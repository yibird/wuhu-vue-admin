import type {
  WorkflowSchema,
  WorkflowStep,
  WorkflowStepSchema,
} from '../schema/types'
import type { RuntimeApi } from './runtime'

export interface WorkflowRunLog {
  stepId: string
  type: string
  status: 'success' | 'error' | 'skipped'
  message?: string
  duration: number
}

export interface WorkflowRunResult {
  status: 'success' | 'error'
  logs: WorkflowRunLog[]
  error?: unknown
}

interface RunState {
  runtime: RuntimeApi
  logs: WorkflowRunLog[]
  env: Record<string, unknown>
}

async function runSteps(
  steps: WorkflowStepSchema[],
  state: RunState
): Promise<void> {
  for (const step of steps) {
    await runStep(step as WorkflowStep, state)
  }
}

async function runStep(step: WorkflowStep, state: RunState) {
  const startedAt = performance.now()
  try {
    await executeStep(step, state)
    state.logs.push({
      stepId: step.id,
      type: step.type,
      status: 'success',
      duration: Math.round(performance.now() - startedAt),
    })
  } catch (error) {
    state.logs.push({
      stepId: step.id,
      type: step.type,
      status: 'error',
      message: error instanceof Error ? error.message : '步骤执行失败',
      duration: Math.round(performance.now() - startedAt),
    })
    if (step.onError?.length) {
      await runSteps(step.onError, state)
      return
    }
    throw error
  }
}

async function executeStep(step: WorkflowStep, state: RunState) {
  switch (step.type) {
    case 'action': {
      const actionId = step.action
      if (!actionId) return
      await state.runtime.runAction(actionId, state.env)
      return
    }

    case 'condition': {
      const result = state.runtime.evaluate(step.condition, {
        fallback: false,
        scope: state.env,
      })
      const branch = result ? step.then : (step.else ?? [])
      await runSteps(branch, state)
      return
    }

    case 'parallel': {
      await Promise.all(step.steps.map((child) => runStep(child, state)))
      return
    }

    case 'loop': {
      const items = state.runtime.evaluate(step.items, {
        fallback: [],
        scope: state.env,
      })
      const list = Array.isArray(items) ? items : []
      const itemName = step.item || 'item'
      for (const [index, item] of list.entries()) {
        state.env[itemName] = item
        state.env.$index = index
        await runSteps(step.steps, state)
      }
      delete state.env[itemName]
      return
    }

    default:
      return
  }
}

/**
 * Workflow Runtime：执行多个 Action + 条件/并行/循环与错误处理。
 * 与 Action 的边界：Action 是单个可执行行为，Workflow 负责流程编排。
 */
export async function runWorkflow(
  workflow: WorkflowSchema,
  runtime: RuntimeApi,
  env: Record<string, unknown> = {}
): Promise<WorkflowRunResult> {
  const state: RunState = { runtime, logs: [], env: { ...env } }
  try {
    await runSteps(workflow.steps, state)
    return { status: 'success', logs: state.logs }
  } catch (error) {
    return { status: 'error', logs: state.logs, error }
  }
}
