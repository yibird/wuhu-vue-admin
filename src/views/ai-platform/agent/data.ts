import { knowledgeBaseResources } from '../knowledge-base/data'
import { modelResources } from '../model/data'
import type { AgentItem, AgentPageConfig, AgentSkillOption } from './types'

export const agentPageConfig: AgentPageConfig = {
  kind: 'agent',
  title: 'Agent',
  subtitle: '管理企业内可复用的智能体，覆盖经营分析、客服、审批和运维场景。',
  icon: 'i-lucide:bot',
  createText: '新建 Agent',
  searchPlaceholder: '搜索 Agent 名称、描述、标签或创建人',
  emptyText: '没有符合条件的 Agent',
  totalText: 'Agent',
  activeText: '运行中',
  draftText: '草稿',
  statusLabels: {
    online: '运行中',
    draft: '草稿',
    offline: '已停用',
  },
}

/**
 * Agent 可启用的技能
 *
 * 技能是 Agent 的能力开关,词表与「模型能力」保持一致的语义颗粒度。
 */
export const agentSkills: AgentSkillOption[] = [
  {
    value: 'web-search',
    label: '联网搜索',
    description: '实时检索公开资料并给出处',
    icon: 'i-lucide:search',
  },
  {
    value: 'code-runner',
    label: '代码执行',
    description: '运行脚本完成数据处理与计算',
    icon: 'i-lucide:terminal',
  },
  {
    value: 'doc-parser',
    label: '文档解析',
    description: '解析 PDF / Word / Excel 内容',
    icon: 'i-lucide:file-text',
  },
  {
    value: 'image-understanding',
    label: '图片理解',
    description: '识别截图、设计稿与图片素材',
    icon: 'i-lucide:image',
  },
  {
    value: 'data-analysis',
    label: '数据分析',
    description: '聚合指标、发现趋势与异常',
    icon: 'i-lucide:chart-column',
  },
  {
    value: 'multi-language',
    label: '多语言',
    description: '多语种翻译与润色',
    icon: 'i-lucide:languages',
  },
]

/**
 * 模型下拉选项,数据来自模型列表页
 */
export const agentModelOptions = modelResources.map((item) => ({
  label: `${item.name} · ${item.providerName}`,
  value: item.id,
}))

/**
 * 知识库下拉选项,数据来自知识库页
 */
export const agentKnowledgeBaseOptions = knowledgeBaseResources.map((item) => ({
  label: item.name,
  value: item.id,
}))

/**
 * 模型 id -> 名称,供卡片展示
 */
const agentModelLabels: Record<string, string> = Object.fromEntries(
  modelResources.map((item) => [item.id, item.name])
)

/**
 * 取模型展示名,未匹配到时回退为原始 id
 *
 * @param id 模型 id
 * @returns 模型名称
 */
export function getAgentModelLabel(id: string) {
  return agentModelLabels[id] ?? id
}

export const agentResources: AgentItem[] = [
  {
    id: 'agent-sales-insight',
    kind: 'agent',
    name: '销售洞察 Agent',
    description:
      '自动汇总 CRM 线索、商机推进和客户跟进记录，生成销售机会建议。',
    tags: ['CRM', '销售分析', '日报'],
    creator: { name: '陈晓', role: '增长运营' },
    createdAt: '2026-07-18 09:32',
    updatedAt: '2026-08-04 09:10',
    status: 'online',
    icon: 'i-lucide:chart-no-axes-combined',
    iconBackground: '#DBEAFE',
    modelId: 'model-gpt-4o',
    skillIds: ['web-search', 'data-analysis'],
    knowledgeBaseIds: ['kb-product-handbook', 'kb-bi-metrics'],
    subAgentIds: ['agent-bi-narrator'],
    metrics: [
      { label: '调用次数', value: '18.6k', tone: 'primary' },
      { label: '成功率', value: '98.2%', tone: 'success' },
      { label: '平均耗时', value: '2.1s' },
    ],
  },
  {
    id: 'agent-finance-check',
    kind: 'agent',
    name: '财务核对 Agent',
    description: '比对发票、收款、对账单和费用申请，识别金额差异与异常科目。',
    tags: ['财务', '对账', '风控'],
    creator: { name: '林佳', role: '财务 BP' },
    createdAt: '2026-07-21 14:08',
    updatedAt: '2026-08-03 17:42',
    status: 'online',
    icon: 'i-lucide:badge-dollar-sign',
    iconBackground: '#DCFCE7',
    modelId: 'model-claude-sonnet',
    skillIds: ['doc-parser', 'data-analysis'],
    knowledgeBaseIds: ['kb-finance-policy', 'kb-contract-clause'],
    subAgentIds: ['agent-contract-review'],
    metrics: [
      { label: '核对单据', value: '42k', tone: 'primary' },
      { label: '异常命中', value: '312', tone: 'warning' },
      { label: '准确率', value: '97.6%', tone: 'success' },
    ],
  },
  {
    id: 'agent-approval-copilot',
    kind: 'agent',
    name: '审批助手 Agent',
    description: '读取审批流上下文，辅助判断节点条件、审批意见和下一步处理人。',
    tags: ['审批流', '规则判断', '企业协同'],
    creator: { name: '周然', role: '流程顾问' },
    createdAt: '2026-07-26 10:25',
    updatedAt: '2026-08-04 08:48',
    status: 'draft',
    icon: 'i-lucide:workflow',
    iconBackground: '#EDE9FE',
    modelId: 'model-glm-4-plus',
    skillIds: ['doc-parser'],
    knowledgeBaseIds: ['kb-implementation-playbook'],
    subAgentIds: ['agent-finance-check'],
    metrics: [
      { label: '测试用例', value: '86' },
      { label: '覆盖率', value: '82%', tone: 'warning' },
      { label: '版本', value: 'v0.8' },
    ],
  },
  {
    id: 'agent-warehouse-ops',
    kind: 'agent',
    name: '仓储调度 Agent',
    description: '结合 WMS 库存、波次任务和异常拣货记录，给出补货与调度建议。',
    tags: ['WMS', '库存', '调度'],
    creator: { name: '赵敏', role: '仓储主管' },
    createdAt: '2026-07-12 16:20',
    updatedAt: '2026-08-02 11:36',
    status: 'online',
    icon: 'i-lucide:package-check',
    iconBackground: '#FFEDD5',
    modelId: 'model-kimi-k2',
    skillIds: ['data-analysis', 'code-runner'],
    knowledgeBaseIds: ['kb-warehouse-sop'],
    subAgentIds: [],
    metrics: [
      { label: '任务量', value: '9.4k', tone: 'primary' },
      { label: '节省工时', value: '186h', tone: 'success' },
      { label: '异常率', value: '1.8%' },
    ],
  },
  {
    id: 'agent-service-reply',
    kind: 'agent',
    name: '客服回复 Agent',
    description:
      '根据客户画像、历史工单和知识库生成回复草稿，并自动标记情绪风险。',
    tags: ['客服', '工单', '知识库'],
    creator: { name: '王若溪', role: '客服经理' },
    createdAt: '2026-07-29 11:50',
    updatedAt: '2026-08-04 10:16',
    status: 'online',
    icon: 'i-lucide:headphones',
    iconBackground: '#FCE7F3',
    modelId: 'model-gpt-4o-mini',
    skillIds: ['web-search', 'multi-language'],
    knowledgeBaseIds: ['kb-customer-service', 'kb-product-handbook'],
    subAgentIds: ['agent-sales-insight', 'agent-bi-narrator'],
    metrics: [
      { label: '接待量', value: '12.8k', tone: 'primary' },
      { label: '采纳率', value: '74%', tone: 'success' },
      { label: '风险提醒', value: '96', tone: 'warning' },
    ],
  },
  {
    id: 'agent-bi-narrator',
    kind: 'agent',
    name: 'BI 解读 Agent',
    description: '将看板指标、同比环比和异常波动转换成管理层可读的经营结论。',
    tags: ['BI', '指标解读', '管理驾驶舱'],
    creator: { name: '许宁', role: '数据产品' },
    createdAt: '2026-07-30 15:12',
    updatedAt: '2026-08-01 18:22',
    status: 'offline',
    icon: 'i-lucide:presentation',
    iconBackground: '#CFFAFE',
    modelId: 'model-deepseek-v3',
    skillIds: ['data-analysis', 'code-runner'],
    knowledgeBaseIds: ['kb-bi-metrics'],
    subAgentIds: [],
    metrics: [
      { label: '看板接入', value: '28' },
      { label: '订阅用户', value: '134' },
      { label: '状态', value: '维护中', tone: 'warning' },
    ],
  },
  {
    id: 'agent-contract-review',
    kind: 'agent',
    name: '合同审阅 Agent',
    description: '提取合同条款、付款节点和风险义务，为法务与销售生成修改建议。',
    tags: ['合同', '法务', '风险提示'],
    creator: { name: '顾言', role: '法务顾问' },
    createdAt: '2026-07-16 13:40',
    updatedAt: '2026-08-03 09:18',
    status: 'online',
    icon: 'i-lucide:file-check-2',
    iconBackground: '#E0E7FF',
    modelId: 'model-gemini-pro',
    skillIds: ['doc-parser', 'multi-language'],
    knowledgeBaseIds: ['kb-contract-clause', 'kb-finance-policy'],
    subAgentIds: [],
    metrics: [
      { label: '审阅合同', value: '1.2k', tone: 'primary' },
      { label: '风险项', value: '428', tone: 'warning' },
      { label: '节省时长', value: '320h', tone: 'success' },
    ],
  },
  {
    id: 'agent-report-builder',
    kind: 'agent',
    name: '报表生成 Agent',
    description:
      '根据自然语言生成报表字段、过滤条件和导出模板，辅助实施顾问交付。',
    tags: ['报表', '低代码', '导出'],
    creator: { name: '沈牧', role: '实施顾问' },
    createdAt: '2026-08-01 10:05',
    updatedAt: '2026-08-04 09:58',
    status: 'draft',
    icon: 'i-lucide:table-properties',
    iconBackground: '#CCFBF1',
    modelId: 'model-qwen-max',
    skillIds: ['data-analysis', 'doc-parser'],
    knowledgeBaseIds: ['kb-bi-metrics', 'kb-product-handbook'],
    subAgentIds: [],
    metrics: [
      { label: '模板数', value: '16' },
      { label: '通过率', value: '88%', tone: 'warning' },
      { label: '版本', value: 'v0.6' },
    ],
  },
]

/**
 * 标签下拉选项,取自现有 Agent 的标签去重结果
 *
 * 标签选择使用 tags 模式,这里只提供候选项,仍支持直接输入新标签
 */
export const agentTagOptions: Array<{ label: string; value: string }> = [
  ...new Set(agentResources.flatMap((item) => item.tags)),
].map((tag) => ({ label: tag, value: tag }))

/**
 * 子 Agent 下拉选项:把已有 Agent 作为能力挂载到新建 Agent 上
 *
 * 排除仍未发布的草稿,避免把不可用的 Agent 挂成依赖
 */
export const agentSubAgentOptions = agentResources
  .filter((item) => item.status !== 'draft')
  .map((item) => ({ label: item.name, value: item.id }))
