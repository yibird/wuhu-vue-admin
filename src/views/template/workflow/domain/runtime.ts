import { getExecutionDescendants } from './compiler'
import type {
  JsonValue,
  WorkflowExecutionPlan,
  WorkflowExecutionStep,
  WorkflowNodeExecution,
  WorkflowRunEvent,
  WorkflowRunResult,
  WorkflowRunStatus,
} from './types'

export interface WorkflowExecutionContext {
  runId: string
  plan: WorkflowExecutionPlan
  step: WorkflowExecutionStep
  input: JsonValue
  variables: Record<string, JsonValue>
  outputs: Record<string, JsonValue>
  signal: AbortSignal
}

export interface WorkflowNodeExecutionResult {
  output?: JsonValue
  variables?: Record<string, JsonValue>
}

export type WorkflowNodeExecutor = (
  context: WorkflowExecutionContext
) => Promise<WorkflowNodeExecutionResult>

export interface WorkflowRuntimeOptions {
  startNodeId?: string
  onlyNodeId?: string
  breakpoints?: Set<string>
  signal?: AbortSignal
  onEvent?: (event: WorkflowRunEvent) => void
  onBreakpoint?: (event: WorkflowRunEvent) => Promise<void> | void
}

function now() {
  return new Date().toISOString()
}

function event(
  runId: string,
  type: WorkflowRunEvent['type'],
  level: WorkflowRunEvent['level'],
  message: string,
  nodeId?: string,
  data?: JsonValue,
  execution?: WorkflowNodeExecution
): WorkflowRunEvent {
  return {
    id: `event:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 7)}`,
    runId,
    timestamp: now(),
    type,
    level,
    message,
    nodeId,
    execution,
    data,
  }
}

function defaultExecutor(
  context: WorkflowExecutionContext
): Promise<WorkflowNodeExecutionResult> {
  const { nodeType, config } = context.step
  const { input } = context
  if (nodeType === 'set-variable') {
    const key = typeof config.variable === 'string' ? config.variable : ''
    return Promise.resolve({
      output: input,
      variables: key ? { [key]: input } : {},
    })
  }
  if (nodeType === 'variable') {
    const key = typeof config.variable === 'string' ? config.variable : ''
    return Promise.resolve({ output: context.variables[key] ?? null })
  }
  if (nodeType === 'start' || nodeType === 'workflow-input')
    return Promise.resolve({
      output:
        nodeType === 'start' &&
        typeof input === 'string' &&
        context.step.outputPorts.includes('query')
          ? { input, query: input }
          : input,
    })
  if (nodeType === 'end' || nodeType === 'workflow-output')
    return Promise.resolve({ output: input })
  return Promise.resolve({ output: { node: context.step.name, input } })
}

function getInput(
  step: WorkflowExecutionStep,
  outputs: Record<string, JsonValue>,
  input: JsonValue,
  variables: Record<string, JsonValue>
): JsonValue {
  const bindings = Object.entries(step.inputBindings)
  if (!bindings.length) return input
  const resolved: Record<string, JsonValue> = {}
  bindings.forEach(([port, binding]) => {
    if (binding.kind === 'literal') resolved[port] = binding.value
    else if (binding.kind === 'workflow-input') resolved[port] = input
    else if (binding.kind === 'variable')
      resolved[port] = variables[binding.variable] ?? null
    else if (binding.kind === 'node-output')
      resolved[port] = outputs[`${binding.nodeId}.${binding.port}`] ?? null
    else if (binding.kind === 'template') resolved[port] = binding.template
    else resolved[port] = binding.expression
  })
  return resolved
}

function sleep(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Execution cancelled', 'AbortError'))
      return
    }
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Execution cancelled', 'AbortError'))
      },
      { once: true }
    )
  })
}

async function executeWithTimeout(
  executor: WorkflowNodeExecutor,
  context: WorkflowExecutionContext,
  timeoutMs: number,
  signal: AbortSignal
) {
  const controller = new AbortController()
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined
  let rejectCancelled: ((reason?: unknown) => void) | undefined
  const abort = () => {
    controller.abort()
    rejectCancelled?.(new DOMException('Execution cancelled', 'AbortError'))
  }
  const timeout = new Promise<never>((_, reject) => {
    timeoutTimer = setTimeout(() => {
      controller.abort()
      reject(new Error('NODE_TIMEOUT'))
    }, timeoutMs)
  })
  const cancelled = new Promise<never>((_, reject) => {
    rejectCancelled = reject
  })
  if (signal.aborted) abort()
  else signal.addEventListener('abort', abort, { once: true })
  try {
    return await Promise.race([
      executor({ ...context, signal: controller.signal }),
      timeout,
      cancelled,
    ])
  } catch (error) {
    if (!signal.aborted && controller.signal.aborted)
      throw new Error('NODE_TIMEOUT')
    throw error
  } finally {
    if (timeoutTimer) clearTimeout(timeoutTimer)
    rejectCancelled = undefined
    signal.removeEventListener('abort', abort)
    controller.abort()
  }
}

export async function executeWorkflow(
  plan: WorkflowExecutionPlan,
  input: JsonValue,
  executors: Partial<
    Record<WorkflowExecutionStep['nodeType'], WorkflowNodeExecutor>
  > = {},
  options: WorkflowRuntimeOptions = {}
): Promise<WorkflowRunResult> {
  const runId = `run:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 7)}`
  const controller = new AbortController()
  const signal = options.signal ?? controller.signal
  const startedAt = now()
  const events: WorkflowRunEvent[] = []
  const executions: WorkflowNodeExecution[] = []
  const variables: Record<string, JsonValue> = { ...plan.variables }
  const outputs: Record<string, JsonValue> = {}
  const startNodeId = options.startNodeId ?? plan.startNodeId
  const selectedNodes = options.onlyNodeId
    ? new Set([options.onlyNodeId])
    : getExecutionDescendants(plan, startNodeId)
  const emit = (item: WorkflowRunEvent) => {
    events.push(item)
    options.onEvent?.(item)
  }

  emit(
    event(
      runId,
      'run-started',
      'info',
      `开始执行：${plan.workflowId}`,
      startNodeId
    )
  )
  let status: WorkflowRunStatus = 'success'
  let terminalMessage = '工作流执行完成'
  try {
    for (const stage of plan.stages) {
      const stageSteps = plan.steps.filter(
        (step) =>
          stage.stepIds.includes(step.id) && selectedNodes.has(step.nodeId)
      )
      await Promise.all(
        stageSteps.map(async (step) => {
          if (signal.aborted)
            throw new DOMException('Execution cancelled', 'AbortError')
          const execution: WorkflowNodeExecution = {
            id: `execution:${runId}:${step.nodeId}`,
            runId,
            nodeId: step.nodeId,
            nodeType: step.nodeType,
            name: step.name,
            status: 'running',
            attempt: 0,
            startedAt: now(),
          }
          executions.push(execution)
          emit(
            event(
              runId,
              'node-started',
              'info',
              `开始执行节点：${step.name}`,
              step.nodeId,
              undefined,
              execution
            )
          )
          if (options.breakpoints?.has(step.nodeId)) {
            execution.status = 'paused'
            emit(
              event(
                runId,
                'node-paused',
                'warning',
                `命中断点，已暂停：${step.name}`,
                step.nodeId,
                undefined,
                execution
              )
            )
            await options.onBreakpoint?.(
              event(
                runId,
                'node-paused',
                'warning',
                `等待继续执行：${step.name}`,
                step.nodeId,
                undefined,
                execution
              )
            )
          }

          const executor = executors[step.nodeType] ?? defaultExecutor
          const maxAttempts = Math.max(1, step.runtime.retry?.maxAttempts ?? 1)
          let lastError: unknown
          for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            try {
              execution.attempt = attempt
              const resolvedInput = getInput(step, outputs, input, variables)
              execution.input = resolvedInput
              const result = await executeWithTimeout(
                executor,
                {
                  runId,
                  plan,
                  step,
                  input: resolvedInput,
                  variables,
                  outputs,
                  signal,
                },
                step.runtime.timeoutMs ?? 30_000,
                signal
              )
              execution.status = 'success'
              execution.output = result.output ?? null
              execution.finishedAt = now()
              execution.durationMs =
                Date.parse(execution.finishedAt) -
                Date.parse(execution.startedAt ?? execution.finishedAt)
              outputs[`${step.nodeId}.output`] = execution.output
              outputs[`${step.nodeId}.result`] = execution.output
              if (
                execution.output &&
                typeof execution.output === 'object' &&
                !Array.isArray(execution.output)
              ) {
                Object.entries(execution.output).forEach(([port, value]) => {
                  outputs[`${step.nodeId}.${port}`] = value
                })
              }
              step.outputPorts.forEach((port) => {
                const key = `${step.nodeId}.${port}`
                if (!(key in outputs)) outputs[key] = execution.output ?? null
              })
              Object.assign(variables, result.variables)
              emit(
                event(
                  runId,
                  'node-completed',
                  'success',
                  `节点执行完成：${step.name}`,
                  step.nodeId,
                  execution.output,
                  execution
                )
              )
              return
            } catch (error) {
              lastError = error
              if (signal.aborted) throw error
              if (attempt < maxAttempts)
                await sleep(
                  Math.min(
                    step.runtime.retry?.maxDelayMs ?? 5_000,
                    (step.runtime.retry?.initialDelayMs ?? 250) *
                      2 ** (attempt - 1)
                  ),
                  signal
                )
            }
          }
          const message =
            lastError instanceof Error ? lastError.message : '节点执行失败'
          execution.status = step.runtime.continueOnError ? 'skipped' : 'failed'
          execution.error = {
            code:
              message === 'NODE_TIMEOUT'
                ? 'NODE_TIMEOUT'
                : 'NODE_EXECUTION_FAILED',
            message,
            retryable: false,
          }
          execution.finishedAt = now()
          emit(
            event(
              runId,
              step.runtime.continueOnError ? 'node-skipped' : 'node-failed',
              step.runtime.continueOnError ? 'warning' : 'error',
              step.runtime.continueOnError
                ? `节点已跳过：${step.name}`
                : `节点执行失败：${step.name}`,
              step.nodeId,
              undefined,
              execution
            )
          )
          if (!step.runtime.continueOnError) throw new Error(message)
        })
      )
    }
  } catch (error) {
    status = signal.aborted ? 'cancelled' : 'failed'
    terminalMessage =
      error instanceof Error
        ? error.message
        : status === 'cancelled'
          ? '工作流执行已取消'
          : '工作流执行失败'
  }
  const finishedAt = now()
  emit(
    event(
      runId,
      status === 'success'
        ? 'run-completed'
        : status === 'cancelled'
          ? 'run-cancelled'
          : 'run-failed',
      status === 'success'
        ? 'success'
        : status === 'cancelled'
          ? 'warning'
          : 'error',
      status === 'success'
        ? '工作流执行完成'
        : status === 'cancelled'
          ? '工作流执行已取消'
          : terminalMessage
    )
  )
  return {
    id: runId,
    planId: plan.id,
    status,
    startedAt,
    finishedAt,
    durationMs: Date.parse(finishedAt) - Date.parse(startedAt),
    input,
    output: outputs[`${plan.outputNodes.at(-1)}.output`],
    executions,
    events,
  }
}

export function createWorkflowRuntime(
  executors: Partial<
    Record<WorkflowExecutionStep['nodeType'], WorkflowNodeExecutor>
  > = {}
) {
  let controller: AbortController | undefined
  const resumeBreakpoints = new Set<() => void>()

  function releaseBreakpoints() {
    resumeBreakpoints.forEach((resume) => resume())
    resumeBreakpoints.clear()
  }

  return {
    cancel() {
      releaseBreakpoints()
      controller?.abort()
    },
    async execute(
      plan: WorkflowExecutionPlan,
      input: JsonValue,
      options: Omit<WorkflowRuntimeOptions, 'signal'> = {}
    ) {
      controller?.abort()
      releaseBreakpoints()
      controller = new AbortController()
      const result = executeWorkflow(plan, input, executors, {
        ...options,
        signal: controller.signal,
        onBreakpoint: () =>
          new Promise<void>((resolve) => {
            const resume = () => {
              resumeBreakpoints.delete(resume)
              resolve()
            }
            resumeBreakpoints.add(resume)
          }),
      })
      return result
    },
    resume() {
      releaseBreakpoints()
    },
  }
}
