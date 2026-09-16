import {
  areWorkflowDataSchemasCompatible,
  getWorkflowNodeDefinition,
  isWorkflowNodeKind,
} from './registry'
import { WORKFLOW_DSL_VERSION } from './types'
import type {
  WorkflowJsonSchema,
  WorkflowSchemaNode,
  WorkflowValidationIssue,
  WorkflowValidationResult,
} from './types'

function issue(
  code: string,
  message: string,
  path: string,
  options: Partial<WorkflowValidationIssue> = {}
): WorkflowValidationIssue {
  return { code, message, path, severity: 'error', ...options }
}

function hasOwn(value: object, key: string) {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function matchesDataType(value: unknown, type: string, nullable = false) {
  if (value === null) return nullable || type === 'any' || type === 'null'
  if (type === 'any') return true
  if (type === 'array') return Array.isArray(value)
  if (type === 'object') return isRecord(value)
  if (type === 'integer') return Number.isInteger(value)
  if (type === 'number') return typeof value === 'number'
  if (type === 'boolean') return typeof value === 'boolean'
  if (type === 'string') return typeof value === 'string'
  return true
}

function validateInterfaceFields(
  value: unknown,
  path: string,
  issues: WorkflowValidationIssue[]
) {
  if (!Array.isArray(value)) return
  const keys = new Set<string>()
  value.forEach((field, index) => {
    const fieldPath = `${path}[${index}]`
    if (!isRecord(field)) {
      issues.push(
        issue('invalid-interface-field', '接口字段必须是对象。', fieldPath)
      )
      return
    }
    const key = typeof field.key === 'string' ? field.key.trim() : ''
    if (!key)
      issues.push(
        issue('missing-interface-key', '接口字段缺少 key。', fieldPath)
      )
    else if (keys.has(key))
      issues.push(
        issue('duplicate-interface-key', `接口字段 key 重复：${key}`, fieldPath)
      )
    else keys.add(key)
    if (!isRecord(field.schema) || typeof field.schema.type !== 'string')
      issues.push(
        issue(
          'invalid-interface-schema',
          '接口字段缺少有效 schema。',
          fieldPath
        )
      )
  })
}

function validateDeclarations(
  schema: WorkflowJsonSchema,
  issues: WorkflowValidationIssue[]
) {
  if (!Array.isArray(schema.variables))
    issues.push(
      issue('invalid-variables', 'variables 必须是数组。', 'variables')
    )
  else {
    const keys = new Set<string>()
    schema.variables.forEach((variable, index) => {
      const path = `variables[${index}]`
      if (!isRecord(variable)) {
        issues.push(issue('invalid-variable', '变量声明必须是对象。', path))
        return
      }
      const key = typeof variable.key === 'string' ? variable.key.trim() : ''
      if (!key)
        issues.push(issue('missing-variable-key', '变量缺少 key。', path))
      else if (keys.has(key))
        issues.push(
          issue('duplicate-variable-key', `变量 key 重复：${key}`, path)
        )
      else keys.add(key)
      if (
        !isRecord(variable.schema) ||
        typeof variable.schema.type !== 'string'
      )
        issues.push(
          issue('invalid-variable-schema', '变量缺少有效 schema。', path)
        )
    })
  }

  if (!Array.isArray(schema.resources))
    issues.push(
      issue('invalid-resources', 'resources 必须是数组。', 'resources')
    )
  else {
    const ids = new Set<string>()
    schema.resources.forEach((resource, index) => {
      const path = `resources[${index}]`
      if (!isRecord(resource)) {
        issues.push(issue('invalid-resource', '资源引用必须是对象。', path))
        return
      }
      const id = typeof resource.id === 'string' ? resource.id.trim() : ''
      if (!id) issues.push(issue('missing-resource-id', '资源缺少 id。', path))
      else if (ids.has(id))
        issues.push(issue('duplicate-resource-id', `资源 id 重复：${id}`, path))
      else ids.add(id)
      if (typeof resource.type !== 'string' || typeof resource.ref !== 'string')
        issues.push(
          issue(
            'invalid-resource-reference',
            '资源必须包含 type 和 ref。',
            path
          )
        )
    })
  }

  if (
    !isRecord(schema.permissions) ||
    !(['owners', 'editors', 'runners', 'viewers'] as const).every((key) =>
      Array.isArray(schema.permissions?.[key])
    )
  )
    issues.push(
      issue(
        'invalid-permissions',
        'permissions 必须声明各类权限主体。',
        'permissions'
      )
    )

  if (
    !isRecord(schema.policies) ||
    typeof schema.policies.timeoutMs !== 'number' ||
    schema.policies.timeoutMs <= 0 ||
    typeof schema.policies.maxConcurrency !== 'number' ||
    schema.policies.maxConcurrency < 1 ||
    !isRecord(schema.policies.retry)
  )
    issues.push(
      issue(
        'invalid-runtime-policy',
        'policies 的超时、并发或重试配置无效。',
        'policies'
      )
    )
}

function collectBindingReferences(
  binding: unknown,
  path: string,
  issues: WorkflowValidationIssue[]
) {
  if (!isRecord(binding) || typeof binding.kind !== 'string') {
    issues.push(issue('invalid-binding', '输入绑定格式不合法。', path))
    return
  }

  if (binding.kind === 'node-output') {
    if (
      typeof binding.nodeId !== 'string' ||
      !binding.nodeId.trim() ||
      typeof binding.port !== 'string' ||
      !binding.port.trim()
    ) {
      issues.push(
        issue(
          'invalid-node-binding',
          '节点输出绑定必须包含 nodeId 和 port。',
          path
        )
      )
    }
    return
  }
  if (binding.kind === 'variable') {
    if (typeof binding.variable === 'string' && binding.variable.trim()) return
    issues.push(
      issue('invalid-variable-binding', '变量绑定必须包含变量标识。', path)
    )
    return
  }
  if (binding.kind === 'workflow-input') {
    if (typeof binding.input === 'string' && binding.input.trim()) return
    issues.push(
      issue('invalid-input-binding', '工作流输入绑定必须包含输入字段。', path)
    )
    return
  }
  if (binding.kind === 'expression') {
    if (typeof binding.expression === 'string' && binding.expression.trim())
      return
    issues.push(
      issue('invalid-expression-binding', '表达式绑定不能为空。', path)
    )
    return
  }
  if (binding.kind === 'template') {
    if (typeof binding.template === 'string' && binding.template.trim()) return
    issues.push(issue('invalid-template-binding', '模板绑定不能为空。', path))
    return
  }
  if (binding.kind === 'literal') {
    if (hasOwn(binding, 'value')) return
    issues.push(
      issue('invalid-literal-binding', '字面量绑定缺少 value。', path)
    )
    return
  }
  issues.push(
    issue('invalid-binding-kind', `不支持的绑定类型：${binding.kind}。`, path)
  )
}

function validateNode(
  node: unknown,
  index: number,
  nodeIds: Set<string>,
  issues: WorkflowValidationIssue[]
) {
  const path = `nodes[${index}]`
  if (!isRecord(node)) {
    issues.push(issue('invalid-node', '节点必须是对象。', path))
    return
  }
  const nodeId = typeof node.id === 'string' ? node.id : ''
  if (!nodeId.trim())
    issues.push(issue('missing-node-id', '节点缺少 id。', `${path}.id`))
  else if (nodeIds.has(nodeId))
    issues.push(
      issue('duplicate-node-id', `节点 id 重复：${nodeId}`, `${path}.id`, {
        nodeId,
      })
    )
  else nodeIds.add(nodeId)

  if (!isWorkflowNodeKind(node.type)) {
    issues.push(
      issue(
        'unknown-node-type',
        `节点 ${nodeId || index} 的 type 未注册：${String(node.type)}`,
        `${path}.type`,
        { nodeId: nodeId || undefined }
      )
    )
    return
  }

  const definition = getWorkflowNodeDefinition(node.type)
  if (!definition) return
  if (node.version !== definition.version)
    issues.push(
      issue(
        'unsupported-node-version',
        `节点 ${nodeId} 的版本应为 ${definition.version}，当前为 ${String(node.version)}。`,
        `${path}.version`,
        { nodeId }
      )
    )
  const nodeName = typeof node.name === 'string' ? node.name : ''
  if (!nodeName.trim())
    issues.push(
      issue('missing-node-name', `节点 ${nodeId} 缺少名称。`, `${path}.name`, {
        nodeId,
      })
    )
  const config = isRecord(node.config) ? node.config : undefined
  if (!config) {
    issues.push(
      issue(
        'invalid-node-config',
        `节点 ${nodeId} 的 config 必须是对象。`,
        `${path}.config`,
        { nodeId }
      )
    )
  }

  for (const field of definition.config) {
    const value = config?.[field.key]
    if (
      field.required &&
      (!config || !hasOwn(config, field.key) || value === '' || value === null)
    ) {
      issues.push(
        issue(
          'missing-required-config',
          `节点 ${nodeName || nodeId} 缺少配置：${field.label}。`,
          `${path}.config.${field.key}`,
          { nodeId }
        )
      )
    }
    if (
      config &&
      hasOwn(config, field.key) &&
      !matchesDataType(value, field.schema.type, field.schema.nullable)
    ) {
      issues.push(
        issue(
          'invalid-config-type',
          `节点 ${nodeName || nodeId} 的配置「${field.label}」类型应为 ${field.schema.type}。`,
          `${path}.config.${field.key}`,
          { nodeId }
        )
      )
    }
  }

  const inputBindings = isRecord(node.inputBindings)
    ? node.inputBindings
    : undefined
  if (!inputBindings) {
    issues.push(
      issue(
        'invalid-input-bindings',
        `节点 ${nodeId} 的 inputBindings 必须是对象。`,
        `${path}.inputBindings`,
        { nodeId }
      )
    )
  } else {
    Object.entries(inputBindings).forEach(([key, binding]) => {
      if (!definition.inputs.some((port) => port.id === key)) {
        issues.push(
          issue(
            'unknown-input-port',
            `节点 ${nodeId} 不存在输入端口：${key}。`,
            `${path}.inputBindings.${key}`,
            { nodeId }
          )
        )
      }
      collectBindingReferences(binding, `${path}.inputBindings.${key}`, issues)
    })
    definition.inputs.forEach((port) => {
      if (port.required && !hasOwn(inputBindings, port.id)) {
        issues.push(
          issue(
            'missing-required-input',
            `节点 ${nodeName || nodeId} 缺少必填输入：${port.label}。`,
            `${path}.inputBindings.${port.id}`,
            { nodeId }
          )
        )
      }
    })
  }
}

function validateEdge(
  edge: unknown,
  index: number,
  nodeIds: Set<string>,
  nodesById: Map<string, WorkflowSchemaNode>,
  edgeIds: Set<string>,
  issues: WorkflowValidationIssue[]
) {
  const path = `edges[${index}]`
  if (!isRecord(edge)) {
    issues.push(issue('invalid-edge', '连线必须是对象。', path))
    return
  }
  const sourceId = typeof edge.source === 'string' ? edge.source : ''
  const targetId = typeof edge.target === 'string' ? edge.target : ''
  if (!sourceId)
    issues.push(
      issue('invalid-edge-source', '连线 source 必须是字符串。', path)
    )
  if (!targetId)
    issues.push(
      issue('invalid-edge-target', '连线 target 必须是字符串。', path)
    )
  const edgeId = typeof edge.id === 'string' ? edge.id : ''
  if (!edgeId.trim())
    issues.push(issue('missing-edge-id', '连线缺少 id。', `${path}.id`))
  else if (edgeIds.has(edgeId))
    issues.push(
      issue('duplicate-edge-id', `连线 id 重复：${edgeId}`, `${path}.id`, {
        edgeId,
      })
    )
  else edgeIds.add(edgeId)
  if (sourceId && !nodeIds.has(sourceId))
    issues.push(
      issue(
        'missing-edge-source',
        `连线 source 不存在：${sourceId}`,
        `${path}.source`,
        { edgeId: edgeId || undefined }
      )
    )
  if (targetId && !nodeIds.has(targetId))
    issues.push(
      issue(
        'missing-edge-target',
        `连线 target 不存在：${targetId}`,
        `${path}.target`,
        { edgeId: edgeId || undefined }
      )
    )
  if (sourceId && sourceId === targetId)
    issues.push(
      issue('self-loop', `节点不能连接到自身：${sourceId}`, path, {
        edgeId: edgeId || undefined,
      })
    )

  const source = nodesById.get(sourceId)
  const target = nodesById.get(targetId)
  if (
    !source ||
    !target ||
    !isWorkflowNodeKind(source.type) ||
    !isWorkflowNodeKind(target.type)
  )
    return
  const sourceDefinition = getWorkflowNodeDefinition(source.type)
  const targetDefinition = getWorkflowNodeDefinition(target.type)
  if (
    typeof edge.sourcePort === 'string' &&
    !sourceDefinition?.outputs.some((port) => port.id === edge.sourcePort)
  ) {
    issues.push(
      issue(
        'unknown-source-port',
        `节点 ${source.name} 不存在输出端口：${edge.sourcePort}`,
        `${path}.sourcePort`,
        { edgeId: edgeId || undefined, nodeId: source.id }
      )
    )
  }
  if (
    typeof edge.targetPort === 'string' &&
    !targetDefinition?.inputs.some((port) => port.id === edge.targetPort)
  ) {
    issues.push(
      issue(
        'unknown-target-port',
        `节点 ${target.name} 不存在输入端口：${edge.targetPort}`,
        `${path}.targetPort`,
        { edgeId: edgeId || undefined, nodeId: target.id }
      )
    )
  }
  const sourcePort = sourceDefinition?.outputs.find(
    (port) => port.id === edge.sourcePort
  )
  const targetPort = targetDefinition?.inputs.find(
    (port) => port.id === edge.targetPort
  )
  if (
    sourcePort &&
    targetPort &&
    !areWorkflowDataSchemasCompatible(sourcePort.schema, targetPort.schema)
  ) {
    issues.push(
      issue(
        'incompatible-ports',
        `连线的数据类型不兼容：${sourcePort.label} -> ${targetPort.label}。`,
        path,
        {
          edgeId: edgeId || undefined,
          suggestion: '请选择相同类型或 any 类型的输入、输出端口。',
        }
      )
    )
  }
}

function validateReferences(
  schema: WorkflowJsonSchema,
  nodeIds: Set<string>,
  nodesById: Map<string, WorkflowSchemaNode>,
  issues: WorkflowValidationIssue[]
) {
  const interfaceInputs = Array.isArray(schema.interface?.inputs)
    ? schema.interface.inputs
    : []
  const variables = Array.isArray(schema.variables) ? schema.variables : []
  const resources = Array.isArray(schema.resources) ? schema.resources : []
  const inputKeys = new Set(
    interfaceInputs.flatMap((item) =>
      isRecord(item) && typeof item.key === 'string' ? [item.key] : []
    )
  )
  const variableKeys = new Set(
    variables.flatMap((item) =>
      isRecord(item) && typeof item.key === 'string' ? [item.key] : []
    )
  )
  const resourcesById = new Map(
    resources.flatMap((item) =>
      isRecord(item) && typeof item.id === 'string'
        ? [[item.id, item] as const]
        : []
    )
  )
  schema.nodes.forEach((node, index) => {
    if (!isRecord(node)) return
    const nodeId = typeof node.id === 'string' ? node.id : ''
    const inputBindings = isRecord(node.inputBindings) ? node.inputBindings : {}
    Object.entries(inputBindings).forEach(([port, binding]) => {
      const bindingPath = `nodes[${index}].inputBindings.${port}`
      if (!isRecord(binding) || typeof binding.kind !== 'string') return
      if (
        binding.kind === 'workflow-input' &&
        typeof binding.input === 'string' &&
        !inputKeys.has(binding.input)
      ) {
        issues.push(
          issue(
            'missing-workflow-input',
            `节点 ${nodeId} 引用了不存在的工作流输入：${binding.input}`,
            bindingPath,
            { nodeId }
          )
        )
      }
      if (
        binding.kind === 'variable' &&
        typeof binding.variable === 'string' &&
        !variableKeys.has(binding.variable)
      ) {
        issues.push(
          issue(
            'missing-variable',
            `节点 ${nodeId} 引用了不存在的变量：${binding.variable}`,
            bindingPath,
            { nodeId }
          )
        )
      }
      if (binding.kind !== 'node-output') return
      if (
        typeof binding.nodeId !== 'string' ||
        typeof binding.port !== 'string'
      )
        return
      if (!nodeIds.has(binding.nodeId)) {
        issues.push(
          issue(
            'missing-binding-node',
            `节点 ${nodeId} 的绑定引用了不存在的节点：${binding.nodeId}`,
            bindingPath,
            { nodeId }
          )
        )
        return
      }
      const source = nodesById.get(binding.nodeId)
      if (!source || !isWorkflowNodeKind(source.type)) return
      const definition = getWorkflowNodeDefinition(source.type)
      if (!definition?.outputs.some((port) => port.id === binding.port)) {
        issues.push(
          issue(
            'missing-binding-port',
            `节点 ${nodeId} 的绑定引用了不存在的输出端口：${binding.port}`,
            bindingPath,
            { nodeId }
          )
        )
      }
    })

    if (!isWorkflowNodeKind(node.type)) return
    const definition = getWorkflowNodeDefinition(node.type)
    const config = isRecord(node.config) ? node.config : {}
    definition?.config.forEach((field) => {
      if (field.control !== 'resource') return
      const resourceId = config[field.key]
      if (typeof resourceId !== 'string' || !resourceId) return
      const resource = resourcesById.get(resourceId)
      if (!resource) {
        issues.push(
          issue(
            'missing-resource',
            `节点 ${nodeId} 引用了不存在的资源：${resourceId}`,
            `nodes[${index}].config.${field.key}`,
            { nodeId }
          )
        )
      } else if (field.resourceType && resource.type !== field.resourceType) {
        issues.push(
          issue(
            'resource-type-mismatch',
            `资源 ${resourceId} 类型应为 ${field.resourceType}，实际为 ${resource.type}。`,
            `nodes[${index}].config.${field.key}`,
            { nodeId }
          )
        )
      }
    })
  })
}

function validateAcyclic(
  schema: WorkflowJsonSchema,
  issues: WorkflowValidationIssue[]
) {
  const visiting = new Set<string>()
  const visited = new Set<string>()
  const outgoing = new Map<string, string[]>()
  schema.edges.forEach((edge) => {
    if (!isRecord(edge)) return
    if (typeof edge.source !== 'string' || typeof edge.target !== 'string')
      return
    outgoing.set(edge.source, [
      ...(outgoing.get(edge.source) ?? []),
      edge.target,
    ])
  })

  function visit(nodeId: string, trail: string[]) {
    if (visiting.has(nodeId)) {
      issues.push(
        issue(
          'cycle-detected',
          `检测到循环依赖：${[...trail, nodeId].join(' -> ')}`,
          'edges',
          { suggestion: '循环请使用“循环”或“迭代器”节点表达。' }
        )
      )
      return
    }
    if (visited.has(nodeId)) return
    visiting.add(nodeId)
    ;(outgoing.get(nodeId) ?? []).forEach((targetId) =>
      visit(targetId, [...trail, nodeId])
    )
    visiting.delete(nodeId)
    visited.add(nodeId)
  }

  schema.nodes.forEach((node) => {
    if (isRecord(node) && typeof node.id === 'string') visit(node.id, [])
  })
}

function validateTopologyIndexes(
  schema: WorkflowJsonSchema,
  issues: WorkflowValidationIssue[]
) {
  const nextByNode = new Map<string, Set<string>>()
  const prevByNode = new Map<string, Set<string>>()
  schema.edges.forEach((edge) => {
    if (!isRecord(edge)) return
    if (typeof edge.source !== 'string' || typeof edge.target !== 'string')
      return
    const next = nextByNode.get(edge.source) ?? new Set<string>()
    const prev = prevByNode.get(edge.target) ?? new Set<string>()
    next.add(edge.target)
    prev.add(edge.source)
    nextByNode.set(edge.source, next)
    prevByNode.set(edge.target, prev)
  })

  schema.nodes.forEach((node, index) => {
    if (!isRecord(node) || typeof node.id !== 'string') return
    const expectedNext = [...(nextByNode.get(node.id) ?? [])].sort()
    const expectedPrev = [...(prevByNode.get(node.id) ?? [])].sort()
    const actualNext = Array.isArray(node.next) ? [...node.next].sort() : []
    const actualPrev = Array.isArray(node.prev) ? [...node.prev].sort() : []
    if (
      !Array.isArray(node.next) ||
      actualNext.length !== expectedNext.length ||
      actualNext.some((id, itemIndex) => id !== expectedNext[itemIndex])
    ) {
      issues.push(
        issue(
          'invalid-next-index',
          `节点 ${node.name || node.id} 的 next 与 edges 不一致。`,
          `nodes[${index}].next`,
          { nodeId: node.id, suggestion: '请根据出边重新生成 next。' }
        )
      )
    }
    if (
      !Array.isArray(node.prev) ||
      actualPrev.length !== expectedPrev.length ||
      actualPrev.some((id, itemIndex) => id !== expectedPrev[itemIndex])
    ) {
      issues.push(
        issue(
          'invalid-prev-index',
          `节点 ${node.name || node.id} 的 prev 与 edges 不一致。`,
          `nodes[${index}].prev`,
          { nodeId: node.id, suggestion: '请根据入边重新生成 prev。' }
        )
      )
    }
  })
}

function validateReachability(
  schema: WorkflowJsonSchema,
  issues: WorkflowValidationIssue[]
) {
  if (!schema.entrypoint) return
  const outgoing = new Map<string, string[]>()
  schema.edges.forEach((edge) => {
    if (!isRecord(edge)) return
    if (typeof edge.source !== 'string' || typeof edge.target !== 'string')
      return
    outgoing.set(edge.source, [
      ...(outgoing.get(edge.source) ?? []),
      edge.target,
    ])
  })
  const reachable = new Set<string>()
  const queue = [schema.entrypoint]
  while (queue.length) {
    const id = queue.shift()
    if (!id || reachable.has(id)) continue
    reachable.add(id)
    ;(outgoing.get(id) ?? []).forEach((target) => queue.push(target))
  }
  schema.nodes.forEach((node, index) => {
    if (!isRecord(node) || typeof node.id !== 'string') return
    if (reachable.has(node.id) || node.disabled === true) return
    issues.push(
      issue(
        'unreachable-node',
        `节点 ${String(node.name || node.id)} 无法从入口到达。`,
        `nodes[${index}]`,
        {
          nodeId: node.id,
          severity: 'warning',
          suggestion: '请连接该节点、将其禁用或移除。',
        }
      )
    )
  })
}

export function validateWorkflowSchema(
  schema: WorkflowJsonSchema
): WorkflowValidationResult {
  const issues: WorkflowValidationIssue[] = []
  if (!isRecord(schema))
    return {
      valid: false,
      issues: [issue('invalid-schema', '工作流必须是对象。', '$')],
    }
  if (schema.dslVersion !== WORKFLOW_DSL_VERSION)
    issues.push(
      issue(
        'unsupported-dsl-version',
        `不支持的 DSL 版本：${String(schema.dslVersion)}`,
        'dslVersion'
      )
    )
  if (
    typeof schema.id !== 'string' ||
    !schema.id.trim() ||
    typeof schema.key !== 'string' ||
    !schema.key.trim() ||
    typeof schema.version !== 'string' ||
    !schema.version.trim()
  )
    issues.push(
      issue('missing-identity', '工作流必须包含 id、key 和 version。', '$')
    )
  if (typeof schema.namespace !== 'string' || !schema.namespace.trim())
    issues.push(
      issue('missing-namespace', '工作流必须包含 namespace。', 'namespace')
    )
  if (!Array.isArray(schema.triggers)) {
    issues.push(
      issue('invalid-triggers', '工作流 triggers 必须是数组。', 'triggers')
    )
  } else {
    const triggerIds = new Set<string>()
    schema.triggers.forEach((trigger, index) => {
      const path = `triggers[${index}]`
      if (!isRecord(trigger)) {
        issues.push(issue('invalid-trigger', '触发器必须是对象。', path))
        return
      }
      const id = typeof trigger.id === 'string' ? trigger.id : ''
      if (!id) issues.push(issue('missing-trigger-id', '触发器缺少 id。', path))
      else if (triggerIds.has(id))
        issues.push(
          issue('duplicate-trigger-id', `触发器 id 重复：${id}`, `${path}.id`)
        )
      else triggerIds.add(id)
      if (!isRecord(trigger.config))
        issues.push(
          issue('invalid-trigger-config', '触发器 config 必须是对象。', path)
        )
      if (
        !['api', 'event', 'manual', 'schedule', 'webhook'].includes(
          String(trigger.type)
        )
      )
        issues.push(issue('invalid-trigger-type', '触发器 type 无效。', path))
      if (typeof trigger.enabled !== 'boolean')
        issues.push(
          issue(
            'invalid-trigger-enabled',
            '触发器 enabled 必须是布尔值。',
            path
          )
        )
    })
  }
  if (typeof schema.entrypoint !== 'string' || !schema.entrypoint.trim())
    issues.push(
      issue('missing-entrypoint', '工作流缺少 entrypoint。', 'entrypoint')
    )
  if (!Array.isArray(schema.nodes) || !schema.nodes.length)
    issues.push(issue('empty-graph', '工作流至少需要一个节点。', 'nodes'))
  if (!Array.isArray(schema.edges))
    issues.push(issue('invalid-edges', '工作流 edges 必须是数组。', 'edges'))
  if (
    !schema.interface ||
    !Array.isArray(schema.interface.inputs) ||
    !Array.isArray(schema.interface.outputs)
  )
    issues.push(
      issue(
        'invalid-interface',
        '工作流 interface 必须包含 inputs 和 outputs 数组。',
        'interface'
      )
    )
  else {
    validateInterfaceFields(schema.interface.inputs, 'interface.inputs', issues)
    validateInterfaceFields(
      schema.interface.outputs,
      'interface.outputs',
      issues
    )
  }
  validateDeclarations(schema, issues)
  if (
    !isRecord(schema.deployment) ||
    !Array.isArray(schema.deployment.environments) ||
    !['immutable-version', 'replace'].includes(
      String(schema.deployment.strategy)
    ) ||
    typeof schema.deployment.approvalRequired !== 'boolean'
  )
    issues.push(
      issue(
        'invalid-deployment-policy',
        '工作流 deployment 必须声明发布环境。',
        'deployment'
      )
    )
  if (
    !isRecord(schema.observability) ||
    !['debug', 'error', 'info', 'warning'].includes(
      String(schema.observability.logLevel)
    ) ||
    typeof schema.observability.tracing !== 'boolean' ||
    typeof schema.observability.metrics !== 'boolean' ||
    typeof schema.observability.retentionDays !== 'number' ||
    schema.observability.retentionDays < 1 ||
    !Array.isArray(schema.observability.redact)
  )
    issues.push(
      issue(
        'invalid-observability-policy',
        '工作流 observability 必须声明日志留存与脱敏字段。',
        'observability'
      )
    )

  const nodeIds = new Set<string>()
  const nodesById = new Map<string, WorkflowSchemaNode>()
  ;(Array.isArray(schema.nodes) ? schema.nodes : []).forEach((node, index) => {
    validateNode(node, index, nodeIds, issues)
    if (isRecord(node) && typeof node.id === 'string')
      nodesById.set(node.id, node as unknown as WorkflowSchemaNode)
  })
  if (schema.entrypoint && !nodeIds.has(schema.entrypoint))
    issues.push(
      issue(
        'entrypoint-not-found',
        `entrypoint 节点不存在：${schema.entrypoint}`,
        'entrypoint'
      )
    )

  const starts = Array.isArray(schema.nodes)
    ? schema.nodes.filter((node) => isRecord(node) && node.type === 'start')
    : []
  if (starts.length !== 1)
    issues.push(
      issue(
        'invalid-start-count',
        `工作流必须恰好包含一个开始节点，当前为 ${starts.length} 个。`,
        'nodes'
      )
    )
  if (
    starts[0] &&
    typeof starts[0].id === 'string' &&
    schema.entrypoint !== starts[0].id
  )
    issues.push(
      issue(
        'entrypoint-mismatch',
        'entrypoint 必须指向开始节点。',
        'entrypoint'
      )
    )
  if (
    !Array.isArray(schema.nodes) ||
    !schema.nodes.some(
      (node) =>
        isRecord(node) &&
        (node.type === 'end' || node.type === 'workflow-output')
    )
  )
    issues.push(
      issue('missing-output', '工作流必须包含结束或工作流输出节点。', 'nodes')
    )

  const edgeIds = new Set<string>()
  ;(Array.isArray(schema.edges) ? schema.edges : []).forEach((edge, index) =>
    validateEdge(edge, index, nodeIds, nodesById, edgeIds, issues)
  )
  if (Array.isArray(schema.nodes))
    validateReferences(schema, nodeIds, nodesById, issues)
  if (
    Array.isArray(schema.nodes) &&
    schema.nodes.length &&
    Array.isArray(schema.edges)
  )
    validateAcyclic(schema, issues)
  if (Array.isArray(schema.nodes) && Array.isArray(schema.edges))
    validateTopologyIndexes(schema, issues)
  if (Array.isArray(schema.nodes) && Array.isArray(schema.edges))
    validateReachability(schema, issues)

  return { valid: issues.every((item) => item.severity !== 'error'), issues }
}
