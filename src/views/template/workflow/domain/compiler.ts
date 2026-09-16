import { requireWorkflowNodeDefinition } from './registry'
import { validateWorkflowSchema } from './validator'
import type {
  WorkflowExecutionPlan,
  WorkflowExecutionStage,
  WorkflowExecutionStep,
  WorkflowJsonSchema,
  WorkflowNodeRuntimePolicy,
} from './types'

const defaultNodeRuntime: WorkflowNodeRuntimePolicy = {
  timeoutMs: 30_000,
  continueOnError: false,
  retry: {
    maxAttempts: 1,
    backoff: 'exponential',
    initialDelayMs: 250,
    maxDelayMs: 5_000,
    retryOn: [],
  },
}

function createNodeRuntime(
  schema: WorkflowJsonSchema,
  nodeId: string
): WorkflowNodeRuntimePolicy {
  const node = schema.nodes.find((item) => item.id === nodeId)
  const runtime = node?.runtime
  return {
    ...defaultNodeRuntime,
    timeoutMs: runtime?.timeoutMs ?? schema.policies.timeoutMs,
    continueOnError:
      runtime?.continueOnError ??
      schema.policies.failureStrategy === 'continue',
    retry: {
      ...defaultNodeRuntime.retry,
      ...schema.policies.retry,
      ...runtime?.retry,
    },
  }
}

export function compileWorkflowSchema(
  schema: WorkflowJsonSchema
): WorkflowExecutionPlan {
  const validation = validateWorkflowSchema(schema)
  const nodeMap = new Map(schema.nodes.map((node) => [node.id, node]))
  const incoming = new Map<string, string[]>()
  const outgoing = new Map<string, string[]>()
  schema.nodes.forEach((node) => {
    incoming.set(node.id, [])
    outgoing.set(node.id, [])
  })
  schema.edges.forEach((edge) => {
    incoming.set(edge.target, [
      ...(incoming.get(edge.target) ?? []),
      edge.source,
    ])
    outgoing.set(edge.source, [
      ...(outgoing.get(edge.source) ?? []),
      edge.target,
    ])
  })

  const remainingDependencies = new Map(
    [...incoming.entries()].map(([id, dependencies]) => [
      id,
      dependencies.length,
    ])
  )
  const queue = schema.nodes
    .filter((node) => remainingDependencies.get(node.id) === 0)
    .map((node) => node.id)
  const stageByNode = new Map<string, number>()
  const orderedIds: string[] = []
  while (queue.length) {
    const nodeId = queue.shift()
    if (!nodeId) continue
    orderedIds.push(nodeId)
    const stage = stageByNode.get(nodeId) ?? 0
    stageByNode.set(nodeId, stage)
    ;(outgoing.get(nodeId) ?? []).forEach((targetId) => {
      stageByNode.set(
        targetId,
        Math.max(stageByNode.get(targetId) ?? 0, stage + 1)
      )
      const left = (remainingDependencies.get(targetId) ?? 1) - 1
      remainingDependencies.set(targetId, left)
      if (left === 0) queue.push(targetId)
    })
  }

  const steps: WorkflowExecutionStep[] = orderedIds.map((nodeId) => {
    const node = nodeMap.get(nodeId)
    if (!node) throw new Error(`编译时找不到节点：${nodeId}`)
    const definition = requireWorkflowNodeDefinition(node.type)
    return {
      id: `step:${node.id}`,
      nodeId: node.id,
      nodeType: node.type,
      nodeVersion: node.version,
      name: node.name,
      dependencies: incoming.get(node.id) ?? [],
      downstream: outgoing.get(node.id) ?? [],
      stage: stageByNode.get(node.id) ?? 0,
      config: node.config,
      inputBindings: node.inputBindings,
      inputPorts: definition.inputs.map((port) => port.id),
      outputPorts: definition.outputs.map((port) => port.id),
      runtime: createNodeRuntime(schema, node.id),
      sideEffect: definition.sideEffect,
    }
  })
  const stages: WorkflowExecutionStage[] = [
    ...new Set(steps.map((step) => step.stage)),
  ]
    .sort((a, b) => a - b)
    .map((index) => ({
      index,
      stepIds: steps
        .filter((step) => step.stage === index)
        .map((step) => step.id),
    }))

  return {
    id: `plan:${schema.id}:${schema.revision}:${Date.now().toString(36)}`,
    workflowId: schema.id,
    workflowVersion: schema.version,
    revision: schema.revision,
    compiledAt: new Date().toISOString(),
    entrypoint: schema.entrypoint,
    startNodeId: schema.entrypoint,
    steps,
    stages,
    transitions: schema.edges.map((edge) => ({
      id: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      sourcePort: edge.sourcePort,
      targetPort: edge.targetPort,
      kind: edge.kind,
      condition: edge.condition,
      priority: edge.priority,
    })),
    outputNodes: schema.nodes
      .filter((node) => node.type === 'end' || node.type === 'workflow-output')
      .map((node) => node.id),
    variables: Object.fromEntries(
      schema.variables.map((variable) => [
        variable.key,
        variable.default ?? variable.schema.default ?? null,
      ])
    ),
    resources: schema.resources,
    policies: schema.policies,
    observability: schema.observability,
    validation,
  }
}

export function getExecutionDescendants(
  plan: WorkflowExecutionPlan,
  nodeId: string
) {
  const result = new Set<string>()
  const queue = [nodeId]
  const byNode = new Map(plan.steps.map((step) => [step.nodeId, step]))
  while (queue.length) {
    const current = queue.shift()
    if (!current || result.has(current)) continue
    result.add(current)
    byNode.get(current)?.downstream.forEach((id) => queue.push(id))
  }
  return result
}
