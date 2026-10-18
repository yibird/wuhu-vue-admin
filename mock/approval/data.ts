import type {
  ApprovalCategoryResp,
  ApprovalDefinitionResp,
  ApprovalGroupResp,
  ApprovalInstanceResp,
  ApprovalInstanceStep,
} from '@/apis'
import type {
  ApprovalNodeConfig,
  ApprovalWorkflowSchema,
} from '@/components/approval-designer'

const NOW = new Date('2026-10-18T09:30:00+08:00')

function isoOffset(days: number, hours = 0) {
  return new Date(
    NOW.getTime() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000
  ).toISOString()
}

function createBaseFields(index: number) {
  return {
    dataStatus: true,
    deleted: false,
    version: 1,
    sort: index,
    unionId: 1000 + index,
    createdBy: '管理员',
    updatedBy: '管理员',
    createdAt: isoOffset(-30 + index),
    updatedAt: isoOffset(-index),
    remark: '',
  }
}

function createNodeConfig(mode: string): ApprovalNodeConfig {
  return {
    assignee: {
      mode: mode as ApprovalNodeConfig['assignee']['mode'],
      users: [],
      roles: mode === 'role' ? ['部门主管'] : [],
      supervisorLevel: 1,
      multiMode: 'sequential',
      percent: 100,
      emptyStrategy: 'admin',
      allowSelfApproval: false,
      deduplicate: true,
    },
    actions: [
      'agree',
      'reject',
      'transfer',
      'addSigner',
      'rollback',
      'comment',
    ],
    conditionRules: [],
    fieldPermissions: [],
    timeout: {
      enabled: false,
      hours: 24,
      remindEveryHours: 4,
      escalateTo: [],
      autoAction: 'none',
    },
    ccUsers: [],
    formRequiredFields: [],
    messageTemplate: '您有一条审批任务待处理：${workflowName}',
    webhookUrl: '',
    subProcessId: '',
    script: 'return { approved: true }',
  }
}

function createSchema(
  name: string,
  description: string
): ApprovalWorkflowSchema {
  return {
    $schema: 'https://wuhu.dev/schemas/approval-workflow/v1.json',
    settings: {
      id: '',
      name,
      group: '默认分类',
      version: '1.0.0',
      state: 'draft',
      description,
      allowRevoke: true,
      allowResubmit: true,
      allowUrge: true,
      enableWatermark: true,
      enableSignature: true,
      notifyChannels: ['站内信'],
      adminUsers: [],
    },
    formFields: [
      { key: 'applicant', label: '申请人', type: 'user', required: true },
      { key: 'reason', label: '申请事由', type: 'text', required: true },
      { key: 'amount', label: '金额', type: 'money', required: false },
    ],
    nodes: [
      {
        id: 'start',
        type: 'start',
        title: '发起人提交',
        description: '校验必填字段与发起权限',
        icon: 'i-lucide:play-circle',
        accent: '#1677ff',
        required: true,
        config: createNodeConfig('initiator'),
      },
      {
        id: 'approver',
        type: 'approver',
        title: '直属主管审批',
        description: '由直属主管进行审批',
        icon: 'i-lucide:user-check',
        accent: '#1677ff',
        required: false,
        config: createNodeConfig('supervisor'),
      },
      {
        id: 'end',
        type: 'end',
        title: '流程结束',
        description: '归档审批记录',
        icon: 'i-lucide:check-circle-2',
        accent: '#52c41a',
        required: true,
        config: createNodeConfig('initiator'),
      },
    ],
  }
}

export const categoryDataSource: ApprovalCategoryResp[] = [
  {
    ...createBaseFields(0),
    id: 'cat-hr',
    name: '行政人事',
    code: 'HR',
    description: '请假、加班、入职、转正等审批',
    icon: 'i-lucide:users',
    color: '#1677ff',
    definitionCount: 0,
  },
  {
    ...createBaseFields(1),
    id: 'cat-finance',
    name: '财务报销',
    code: 'FINANCE',
    description: '费用报销、付款、借款等审批',
    icon: 'i-lucide:receipt-text',
    color: '#13c2c2',
    definitionCount: 0,
  },
  {
    ...createBaseFields(2),
    id: 'cat-purchase',
    name: '采购合同',
    code: 'PURCHASE',
    description: '采购申请、合同用印、供应商准入',
    icon: 'i-lucide:shopping-cart',
    color: '#fa8c16',
    definitionCount: 0,
  },
  {
    ...createBaseFields(3),
    id: 'cat-sales',
    name: '销售运营',
    code: 'SALES',
    description: '折扣、合同评审、渠道支持',
    icon: 'i-lucide:briefcase-business',
    color: '#722ed1',
    definitionCount: 0,
  },
  {
    ...createBaseFields(4),
    id: 'cat-rd',
    name: '研发协作',
    code: 'RD',
    description: '发布、变更、资源申请',
    icon: 'i-lucide:code-xml',
    color: '#eb2f96',
    definitionCount: 0,
  },
]

const categoryMap = new Map(categoryDataSource.map((item) => [item.id, item]))

export const groupDataSource: ApprovalGroupResp[] = [
  {
    ...createBaseFields(0),
    id: 'group-hr',
    name: '行政人事流程',
    code: 'GRP-HR',
    description: '请假、加班、转正等日常人事审批',
    color: '#1677ff',
    enabled: true,
    definitionIds: ['approval-001', 'approval-002', 'approval-003'],
    definitionCount: 3,
  },
  {
    ...createBaseFields(1),
    id: 'group-finance',
    name: '财务风控流程',
    code: 'GRP-FINANCE',
    description: '报销、付款、借款等资金相关审批',
    color: '#13c2c2',
    enabled: true,
    definitionIds: [
      'approval-004',
      'approval-005',
      'approval-006',
      'approval-007',
    ],
    definitionCount: 4,
  },
  {
    ...createBaseFields(2),
    id: 'group-purchase',
    name: '采购合同流程',
    code: 'GRP-PURCHASE',
    description: '采购申请、合同用印与供应商准入',
    color: '#fa8c16',
    enabled: true,
    definitionIds: [
      'approval-008',
      'approval-009',
      'approval-010',
      'approval-011',
    ],
    definitionCount: 4,
  },
  {
    ...createBaseFields(3),
    id: 'group-rd',
    name: '研发变更流程',
    code: 'GRP-RD',
    description: '发布、变更与资源申请类审批',
    color: '#722ed1',
    enabled: false,
    definitionIds: ['approval-012', 'approval-013', 'approval-014'],
    definitionCount: 3,
  },
]

interface DefinitionSeed {
  name: string
  code: string
  categoryId: string
  icon: string
  description: string
  state: ApprovalDefinitionResp['state']
  ownerId: string
  ownerName: string
  nodeCount: number
  instanceCount: number
}

const definitionSeeds: DefinitionSeed[] = [
  {
    name: '费用报销审批',
    code: 'APV-EXPENSE',
    categoryId: 'cat-finance',
    icon: 'i-lucide:receipt-text',
    description: '主管审批 + 金额条件 + 财务复核 + 抄送',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 6,
    instanceCount: 126,
  },
  {
    name: '请假审批',
    code: 'APV-LEAVE',
    categoryId: 'cat-hr',
    icon: 'i-lucide:calendar-days',
    description: '按请假天数走主管与总监审批',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 5,
    instanceCount: 98,
  },
  {
    name: '采购申请审批',
    code: 'APV-PURCHASE',
    categoryId: 'cat-purchase',
    icon: 'i-lucide:shopping-cart',
    description: '并行财务与法务评审，调用合同子流程',
    state: 'draft',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 7,
    instanceCount: 22,
  },
  {
    name: '合同用印审批',
    code: 'APV-CONTRACT-SEAL',
    categoryId: 'cat-purchase',
    icon: 'i-lucide:stamp',
    description: '合同金额与用印类型双条件分支',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 8,
    instanceCount: 64,
  },
  {
    name: '销售折扣审批',
    code: 'APV-DISCOUNT',
    categoryId: 'cat-sales',
    icon: 'i-lucide:badge-percent',
    description: '按折扣区间与客户等级分流审批',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 6,
    instanceCount: 57,
  },
  {
    name: '加班申请',
    code: 'APV-OVERTIME',
    categoryId: 'cat-hr',
    icon: 'i-lucide:clock-3',
    description: '主管审批 + 人事备案',
    state: 'disabled',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 4,
    instanceCount: 18,
  },
  {
    name: '供应商准入审批',
    code: 'APV-SUPPLIER',
    categoryId: 'cat-purchase',
    icon: 'i-lucide:building-2',
    description: '资质审核、财务评估与合规复核',
    state: 'draft',
    ownerId: 'u-002',
    ownerName: '李航',
    nodeCount: 7,
    instanceCount: 9,
  },
  {
    name: '版本发布审批',
    code: 'APV-RELEASE',
    categoryId: 'cat-rd',
    icon: 'i-lucide:rocket',
    description: '研发、测试、运维多级会签',
    state: 'published',
    ownerId: 'u-003',
    ownerName: '王珂',
    nodeCount: 6,
    instanceCount: 41,
  },
  {
    name: '用款申请',
    code: 'APV-PAYMENT',
    categoryId: 'cat-finance',
    icon: 'i-lucide:banknote',
    description: '按金额区间与预算科目审批',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 5,
    instanceCount: 73,
  },
  {
    name: '入职审批',
    code: 'APV-ONBOARD',
    categoryId: 'cat-hr',
    icon: 'i-lucide:user-plus',
    description: '部门、HR、IT 协同办理',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 6,
    instanceCount: 35,
  },
  {
    name: '服务器资源申请',
    code: 'APV-RESOURCE',
    categoryId: 'cat-rd',
    icon: 'i-lucide:server',
    description: '按资源规格与预算审批',
    state: 'draft',
    ownerId: 'u-005',
    ownerName: '周明',
    nodeCount: 5,
    instanceCount: 12,
  },
  {
    name: '渠道支持申请',
    code: 'APV-CHANNEL',
    categoryId: 'cat-sales',
    icon: 'i-lucide:handshake',
    description: '渠道政策、预算与法务联合审批',
    state: 'published',
    ownerId: '1',
    ownerName: '管理员',
    nodeCount: 7,
    instanceCount: 29,
  },
]

export const definitionDataSource: ApprovalDefinitionResp[] =
  definitionSeeds.map((seed, index) => {
    const schema = createSchema(seed.name, seed.description)
    return {
      ...createBaseFields(index),
      id: `approval-${String(index + 1).padStart(3, '0')}`,
      name: seed.name,
      code: seed.code,
      categoryId: seed.categoryId,
      categoryName: categoryMap.get(seed.categoryId)?.name ?? '未分类',
      icon: seed.icon,
      description: seed.description,
      state: seed.state,
      schema: {
        ...schema,
        settings: {
          ...schema.settings,
          id: `approval-${String(index + 1).padStart(3, '0')}`,
          name: seed.name,
          group: categoryMap.get(seed.categoryId)?.name ?? '未分类',
          state: seed.state === 'published' ? 'published' : 'draft',
          description: seed.description,
        },
      },
      nodeCount: seed.nodeCount,
      instanceCount: seed.instanceCount,
      ownerId: seed.ownerId,
      ownerName: seed.ownerName,
    }
  })

function syncCategoryCounts() {
  categoryDataSource.forEach((category) => {
    category.definitionCount = definitionDataSource.filter(
      (item) => item.categoryId === category.id
    ).length
  })
}

syncCategoryCounts()

const instanceStatuses: ApprovalInstanceResp['status'][] = [
  'running',
  'pending',
  'approved',
  'rejected',
  'timeout',
]

const initiators = [
  { id: 'u-001', name: '张敏', dept: '销售一部' },
  { id: 'u-002', name: '李航', dept: '财务部' },
  { id: 'u-003', name: '王珂', dept: '行政部' },
  { id: 'u-004', name: '赵宁', dept: '总经办' },
  { id: 'u-005', name: '周明', dept: '人力资源' },
]

function createSteps(
  definitionName: string,
  status: ApprovalInstanceResp['status']
): ApprovalInstanceStep[] {
  const stepStatus: ApprovalInstanceStep['status'] =
    status === 'approved'
      ? 'approved'
      : status === 'rejected'
        ? 'rejected'
        : status === 'pending' || status === 'running'
          ? 'pending'
          : 'skipped'

  return [
    {
      id: 'step-start',
      nodeName: '发起人提交',
      approverName: '张敏',
      status: 'approved',
      comment: '提交审批',
      handledAt: isoOffset(-3),
    },
    {
      id: 'step-approver',
      nodeName: '直属主管审批',
      approverName: '王珂',
      status: stepStatus,
      comment:
        stepStatus === 'pending'
          ? '等待处理'
          : stepStatus === 'approved'
            ? '同意'
            : stepStatus === 'rejected'
              ? '不符合要求'
              : '超时未处理',
      handledAt: stepStatus === 'pending' ? undefined : isoOffset(-2, 4),
    },
    {
      id: 'step-end',
      nodeName: `${definitionName}归档`,
      approverName: '系统',
      status: status === 'approved' ? 'approved' : 'pending',
      comment: status === 'approved' ? '流程完成' : '流程未完成',
      handledAt: status === 'approved' ? isoOffset(-2) : undefined,
    },
  ]
}

export const instanceDataSource: ApprovalInstanceResp[] =
  definitionDataSource.flatMap((definition, definitionIndex) =>
    Array.from({ length: 3 }, (_, offset) => {
      const index = definitionIndex * 3 + offset
      const status =
        instanceStatuses[index % instanceStatuses.length] ?? 'running'
      const initiator = initiators[index % initiators.length]
      const startedAt = isoOffset(-(index + 2), index % 12)
      const finished = status === 'approved' || status === 'rejected'
      const durationMs = (12 + (index % 36)) * 60 * 60 * 1000

      return {
        ...createBaseFields(index),
        id: `instance-${String(index + 1).padStart(3, '0')}`,
        definitionId: definition.id,
        definitionName: definition.name,
        title: `${definition.name} - ${initiator.name}`,
        initiatorId: initiator.id,
        initiatorName: initiator.name,
        deptName: initiator.dept,
        status,
        currentNode:
          status === 'running' || status === 'pending'
            ? '直属主管审批'
            : undefined,
        progress:
          status === 'approved'
            ? 100
            : status === 'rejected'
              ? 60
              : status === 'timeout'
                ? 45
                : 35,
        startedAt,
        finishedAt: finished ? isoOffset(-(index + 1), 6) : undefined,
        durationMs: finished ? durationMs : undefined,
        steps: createSteps(definition.name, status),
      } satisfies ApprovalInstanceResp
    })
  )

export function findCategory(id: string) {
  return categoryDataSource.find((item) => item.id === id)
}

export function findDefinition(id: string) {
  return definitionDataSource.find((item) => item.id === id)
}

export function appendDefinition(
  input: Partial<ApprovalDefinitionResp>
): ApprovalDefinitionResp {
  const index = definitionDataSource.length
  const category = findCategory(input.categoryId ?? '')
  const definition: ApprovalDefinitionResp = {
    ...createBaseFields(index),
    id: `approval-${Date.now().toString(36)}`,
    name: input.name ?? '未命名审批流',
    code: input.code ?? `APV-${String(index + 1).padStart(3, '0')}`,
    categoryId: input.categoryId ?? 'cat-hr',
    categoryName: category?.name ?? '未分类',
    icon: input.icon ?? 'i-lucide:workflow',
    description: input.description ?? '',
    state: input.state ?? 'draft',
    schema: input.schema ?? createSchema('未命名审批流', ''),
    nodeCount: input.nodeCount ?? 3,
    instanceCount: 0,
    ownerId: input.ownerId ?? '1',
    ownerName: input.ownerName ?? '管理员',
  }
  definition.schema = {
    ...definition.schema,
    settings: {
      ...definition.schema.settings,
      id: definition.id,
      name: definition.name,
      group: definition.categoryName,
      state: definition.state === 'published' ? 'published' : 'draft',
      description: definition.description ?? '',
    },
  }
  definitionDataSource.unshift(definition)
  syncCategoryCounts()
  return definition
}

export function updateDefinition(
  input: Partial<ApprovalDefinitionResp> & { id: string }
) {
  const current = findDefinition(input.id)
  if (!current) return undefined

  const category = input.categoryId ? findCategory(input.categoryId) : undefined
  Object.assign(current, input, {
    categoryName: category?.name ?? current.categoryName,
    updatedAt: new Date().toISOString(),
    nodeCount: input.schema
      ? countSchemaNodes(input.schema)
      : current.nodeCount,
  })
  current.schema = {
    ...current.schema,
    settings: {
      ...current.schema.settings,
      id: current.id,
      name: current.name,
      group: current.categoryName,
      state: current.state === 'published' ? 'published' : 'draft',
      description: current.description ?? '',
    },
  }
  syncCategoryCounts()
  return current
}

export function publishDefinition(id: string) {
  const current = findDefinition(id)
  if (!current) return undefined
  current.state = 'published'
  current.schema = {
    ...current.schema,
    settings: { ...current.schema.settings, state: 'published' },
  }
  current.updatedAt = new Date().toISOString()
  return current
}

export function duplicateDefinition(id: string) {
  const source = findDefinition(id)
  if (!source) return undefined
  return appendDefinition({
    ...source,
    name: `${source.name} - 副本`,
    state: 'draft',
    instanceCount: 0,
  })
}

export function deleteDefinitions(ids: string[]) {
  for (let index = definitionDataSource.length - 1; index >= 0; index -= 1) {
    if (ids.includes(definitionDataSource[index].id)) {
      definitionDataSource.splice(index, 1)
    }
  }
  ids.forEach((id) => removeDefinitionFromGroups(id))
  syncCategoryCounts()
}

function countSchemaNodes(schema: ApprovalWorkflowSchema): number {
  let count = 0
  const walk = (nodes: ApprovalWorkflowSchema['nodes']) => {
    nodes.forEach((node) => {
      count += 1
      node.children?.forEach((child) => walk([child]))
      node.branches?.forEach((branch) => walk(branch.nodes))
    })
  }
  walk(schema.nodes)
  return count
}

interface CreateCategoryInput {
  name: string
  code?: string
  description?: string
  icon?: string
  color?: string
  sort?: number
}

export function appendCategory(input: CreateCategoryInput) {
  const index = categoryDataSource.length
  const category: ApprovalCategoryResp = {
    ...createBaseFields(index),
    id: `cat-${Date.now().toString(36)}`,
    name: input.name,
    code: input.code ?? `CAT-${String(index + 1).padStart(2, '0')}`,
    description: input.description ?? '',
    icon: input.icon ?? 'i-lucide:folder',
    color: input.color ?? '#1677ff',
    sort: input.sort ?? index,
    definitionCount: 0,
  }
  categoryDataSource.push(category)
  return category
}

export function updateCategory(
  input: Partial<ApprovalCategoryResp> & { id: string }
) {
  const current = findCategory(input.id)
  if (!current) return undefined
  Object.assign(current, input, { updatedAt: new Date().toISOString() })
  definitionDataSource
    .filter((item) => item.categoryId === current.id)
    .forEach((item) => {
      item.categoryName = current.name
    })
  return current
}

export function deleteCategories(ids: string[]) {
  for (let index = categoryDataSource.length - 1; index >= 0; index -= 1) {
    if (ids.includes(categoryDataSource[index].id)) {
      categoryDataSource.splice(index, 1)
    }
  }
}

export function findInstance(id: string) {
  return instanceDataSource.find((item) => item.id === id)
}

export function findGroup(id: string) {
  return groupDataSource.find((item) => item.id === id)
}

function normalizeDefinitionIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return []
  const valid = new Set(definitionDataSource.map((item) => item.id))
  return [...new Set(ids.map(String))].filter((id) => valid.has(id))
}

function withDefinitionCount(group: ApprovalGroupResp): ApprovalGroupResp {
  const definitionIds = normalizeDefinitionIds(group.definitionIds)
  return {
    ...group,
    definitionIds,
    definitionCount: definitionIds.length,
  }
}

export function enrichGroup(group: ApprovalGroupResp) {
  return withDefinitionCount(group)
}

function isGroupCodeTaken(code: string, excludeId?: string) {
  return groupDataSource.some(
    (item) =>
      item.code.toLowerCase() === code.toLowerCase() && item.id !== excludeId
  )
}

export function appendGroup(input: {
  name: string
  code?: string
  description?: string
  color?: string
  enabled?: boolean
  definitionIds?: unknown
  sort?: number
}): string | undefined {
  const code = input.code?.trim()
  if (code && isGroupCodeTaken(code)) return undefined

  const definitionIds = normalizeDefinitionIds(input.definitionIds)
  const assignedIds = new Set(
    groupDataSource.flatMap((group) => group.definitionIds)
  )
  const uniqueIds = definitionIds.filter((id) => !assignedIds.has(id))
  const index = groupDataSource.length
  groupDataSource.push({
    ...createBaseFields(index),
    id: `group-${Date.now().toString(36)}`,
    name: input.name.trim(),
    code: code || `GRP-${String(index + 1).padStart(3, '0')}`,
    description: input.description?.trim() ?? '',
    color: input.color ?? '#1677ff',
    enabled: input.enabled ?? true,
    definitionIds: uniqueIds,
    definitionCount: uniqueIds.length,
    sort: input.sort ?? index,
  })
  return groupDataSource[groupDataSource.length - 1].id
}

export function updateGroup(input: {
  id: string
  name?: string
  code?: string
  description?: string
  color?: string
  enabled?: boolean
  definitionIds?: unknown
  sort?: number
}) {
  const current = findGroup(input.id)
  if (!current) return undefined
  if (input.code && isGroupCodeTaken(input.code, input.id)) return undefined

  if (input.name !== undefined) current.name = input.name.trim()
  if (input.code !== undefined) current.code = input.code.trim() || current.code
  if (input.description !== undefined)
    current.description = input.description.trim()
  if (input.color !== undefined) current.color = input.color
  if (input.enabled !== undefined) current.enabled = input.enabled
  if (input.sort !== undefined) current.sort = input.sort
  if (input.definitionIds !== undefined) {
    const otherIds = new Set(
      groupDataSource
        .filter((item) => item.id !== input.id)
        .flatMap((item) => item.definitionIds)
    )
    const definitionIds = normalizeDefinitionIds(input.definitionIds)
    current.definitionIds = definitionIds.filter((id) => !otherIds.has(id))
    current.definitionCount = current.definitionIds.length
  }
  current.updatedAt = new Date().toISOString()
  return current
}

export function deleteGroups(ids: string[]) {
  for (let index = groupDataSource.length - 1; index >= 0; index -= 1) {
    if (ids.includes(groupDataSource[index].id)) {
      groupDataSource.splice(index, 1)
    }
  }
}

export function removeDefinitionFromGroups(definitionId: string) {
  groupDataSource.forEach((group) => {
    const next = group.definitionIds.filter((id) => id !== definitionId)
    if (next.length !== group.definitionIds.length) {
      group.definitionIds = next
      group.definitionCount = next.length
    }
  })
}
