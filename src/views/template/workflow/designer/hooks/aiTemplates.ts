import type { JsonValue, WorkflowEdgeKind, WorkflowNodeKind } from '../types'

export interface WorkflowAiTemplateNode {
  /**
   * @desc 模板内固定的节点 id,生成结果稳定可读,便于 diff
   */
  id: string
  kind: WorkflowNodeKind
  name: string
  description?: string
  /**
   * @desc 覆盖节点定义的默认配置,未声明的字段仍取注册表默认值
   */
  config?: Record<string, JsonValue>
}

export interface WorkflowAiTemplateEdge {
  source: string
  target: string
  /**
   * @desc 分支输出端口,例如 true / false / approved / rejected
   */
  sourcePort?: string
  label?: string
  kind?: WorkflowEdgeKind
}

export interface WorkflowAiTemplate {
  id: string
  title: string
  summary: string
  /**
   * @desc 命中该模板的关键词,按命中数量打分选模板,数量相同时取靠前的
   */
  keywords: readonly RegExp[]
  nodes: WorkflowAiTemplateNode[]
  edges: WorkflowAiTemplateEdge[]
}

export type WorkflowAiHintPlacement = 'after-start' | 'before-end'

export interface WorkflowAiHint {
  id: string
  label: string
  pattern: RegExp
  /**
   * @desc 插入位置:开始节点之后 / 终止节点之前
   */
  placement: WorkflowAiHintPlacement
  /**
   * @desc 模板已包含这些节点类型时不再补充
   */
  coveredBy: WorkflowNodeKind[]
  nodes: WorkflowAiTemplateNode[]
}

/**
 * 预置工作流模板:按关键词打分匹配,模板本身保证结构合法(单开始节点、含结束节点、无环)
 */
export const workflowAiTemplates: WorkflowAiTemplate[] = [
  {
    id: 'approval',
    title: '申请审批流程',
    summary:
      '查询申请单后按规则自动判断,满足条件自动通过,否则转人工审批并通知结果。',
    keywords: [/审批/, /报销/, /退款/, /请假/, /申请/, /工单/, /转正/, /采购/],
    nodes: [
      {
        id: 'start',
        kind: 'start',
        name: '接收申请单',
        description: '接收业务系统提交的申请单与申请人信息。',
        config: { trigger: 'api' },
      },
      {
        id: 'query-form',
        kind: 'http',
        name: '查询申请单',
        description: '调用业务系统接口获取申请单详情。',
        config: {
          url: 'https://api.internal.example.com/forms/{formId}',
          method: 'GET',
        },
      },
      {
        id: 'auto-check',
        kind: 'if-else',
        name: '自动校验规则',
        description: '按金额与风险评分判断是否可以自动通过。',
        config: { expression: 'form.amount <= 5000 && form.riskScore < 60' },
      },
      {
        id: 'auto-approve',
        kind: 'set-variable',
        name: '标记自动通过',
        description: '写入审批结论,跳过人工环节。',
        config: { variable: 'decision' },
      },
      {
        id: 'manual-approval',
        kind: 'approval',
        name: '人工审批',
        description: '暂停运行并等待审批人给出结论。',
        config: { assignee: 'role:workflow-owner', timeoutHours: 24 },
      },
      {
        id: 'notify-approved',
        kind: 'message',
        name: '通知申请人',
        description: '推送审批通过结果与后续操作指引。',
        config: { channel: 'chat' },
      },
      {
        id: 'notify-rejected',
        kind: 'message',
        name: '通知驳回原因',
        description: '推送驳回结论与修改建议。',
        config: { channel: 'chat' },
      },
      {
        id: 'end',
        kind: 'end',
        name: '结束',
        description: '输出审批结论并结束流程。',
      },
    ],
    edges: [
      { source: 'start', target: 'query-form' },
      { source: 'query-form', target: 'auto-check' },
      {
        source: 'auto-check',
        target: 'auto-approve',
        sourcePort: 'true',
        label: '满足自动通过条件',
      },
      {
        source: 'auto-check',
        target: 'manual-approval',
        sourcePort: 'false',
        label: '需要人工审批',
      },
      { source: 'auto-approve', target: 'notify-approved' },
      {
        source: 'manual-approval',
        target: 'notify-approved',
        sourcePort: 'approved',
        label: '审批通过',
      },
      {
        source: 'manual-approval',
        target: 'notify-rejected',
        sourcePort: 'rejected',
        label: '审批驳回',
      },
      { source: 'notify-approved', target: 'end' },
      { source: 'notify-rejected', target: 'end' },
    ],
  },
  {
    id: 'qa',
    title: '知识库问答流程',
    summary: '先检索知识库召回文档片段,再由大模型生成答复并输出给用户。',
    keywords: [
      /问答/,
      /客服/,
      /咨询/,
      /知识库/,
      /检索/,
      /faq/i,
      /答复/,
      /话术/,
    ],
    nodes: [
      {
        id: 'start',
        kind: 'start',
        name: '接收用户问题',
        description: '接收用户问题与会话标识。',
        config: { trigger: 'api' },
      },
      {
        id: 'retrieve',
        kind: 'knowledge',
        name: '检索知识库',
        description: '召回与问题最相关的知识片段。',
        config: { knowledgeBase: 'kb-product', topK: 5, scoreThreshold: 0.6 },
      },
      {
        id: 'compose',
        kind: 'llm',
        name: '生成答复',
        description: '基于召回内容生成准确、简洁的答复。',
        config: {
          provider: 'llm-main',
          model: 'Doubao-pro-32k',
          systemPrompt: '仅依据检索到的知识库内容回答,无法确认时明确说明。',
          temperature: 0.3,
        },
      },
      {
        id: 'reply',
        kind: 'answer',
        name: '输出答复',
        description: '把答复流式输出给用户。',
      },
      {
        id: 'end',
        kind: 'end',
        name: '结束',
        description: '输出答复与执行摘要。',
      },
    ],
    edges: [
      { source: 'start', target: 'retrieve' },
      { source: 'retrieve', target: 'compose' },
      { source: 'compose', target: 'reply' },
      { source: 'reply', target: 'end' },
    ],
  },
  {
    id: 'classify',
    title: '意图分流流程',
    summary: '识别请求意图后按多路分支路由,命中的走业务答复,其余转人工处理。',
    keywords: [/分类/, /分流/, /意图/, /路由/, /派单/, /分配/, /标签/],
    nodes: [
      {
        id: 'start',
        kind: 'start',
        name: '接收请求',
        description: '接收待分类的业务请求。',
        config: { trigger: 'api' },
      },
      {
        id: 'detect',
        kind: 'question-classifier',
        name: '识别意图',
        description: '按业务分类体系识别请求意图。',
        config: {
          model: 'Doubao-pro-32k',
          classes: [
            { value: 'refund', label: '退款咨询' },
            { value: 'technical', label: '技术支持' },
            { value: 'other', label: '其他' },
          ],
          instruction: '依据用户描述判断所属业务分类,无法判断时归入其他。',
        },
      },
      {
        id: 'route',
        kind: 'switch',
        name: '多路分支',
        description: '按识别结果路由到不同处理分支。',
        config: {
          cases: [
            { value: 'refund', label: '退款咨询' },
            { value: 'technical', label: '技术支持' },
          ],
        },
      },
      {
        id: 'answer-biz',
        kind: 'llm',
        name: '业务答复',
        description: '结合业务知识生成结构化答复。',
        config: {
          provider: 'llm-main',
          model: 'Doubao-pro-32k',
          systemPrompt: '结合业务规则生成结构化答复,并给出可执行建议。',
        },
      },
      {
        id: 'transfer',
        kind: 'approval',
        name: '转人工处理',
        description: '无法自动处理时转交人工坐席。',
        config: { assignee: 'role:service-agent', timeoutHours: 4 },
      },
      {
        id: 'notify',
        kind: 'message',
        name: '发送回执',
        description: '把处理结果回执给请求方。',
        config: { channel: 'chat' },
      },
      {
        id: 'notify-escalate',
        kind: 'message',
        name: '发送超时提醒',
        description: '人工处理超时时提醒负责人跟进。',
        config: { channel: 'chat' },
      },
      {
        id: 'end',
        kind: 'end',
        name: '结束',
        description: '输出分流结果并结束流程。',
      },
    ],
    edges: [
      { source: 'start', target: 'detect' },
      { source: 'detect', target: 'route' },
      {
        source: 'route',
        target: 'answer-biz',
        sourcePort: 'matched',
        label: '命中意图',
      },
      {
        source: 'route',
        target: 'transfer',
        sourcePort: 'default',
        label: '其他意图',
      },
      { source: 'answer-biz', target: 'notify' },
      {
        source: 'transfer',
        target: 'notify',
        sourcePort: 'approved',
        label: '已处理',
      },
      {
        source: 'transfer',
        target: 'notify-escalate',
        sourcePort: 'rejected',
        label: '处理超时',
      },
      { source: 'notify', target: 'end' },
      { source: 'notify-escalate', target: 'end' },
    ],
  },
  {
    id: 'data-sync',
    title: '数据同步流程',
    summary: '拉取外部数据、清洗转换后写入数据库,并发送同步结果通知。',
    keywords: [/同步/, /抓取/, /采集/, /入库/, /etl/i, /对账/, /汇总/, /报表/],
    nodes: [
      {
        id: 'start',
        kind: 'start',
        name: '触发同步任务',
        description: '按调度或手动触发本次同步。',
        config: { trigger: 'manual' },
      },
      {
        id: 'fetch',
        kind: 'http',
        name: '拉取外部数据',
        description: '调用合作方接口拉取增量数据。',
        config: {
          url: 'https://api.partner.example.com/v1/records',
          method: 'GET',
        },
      },
      {
        id: 'transform',
        kind: 'code',
        name: '清洗转换',
        description: '按目标表结构清洗并补齐字段。',
        config: {
          language: 'javascript',
          source:
            'return input.map((item) => ({ ...item, syncedAt: Date.now() }))',
        },
      },
      {
        id: 'persist',
        kind: 'database',
        name: '写入数据表',
        description: '把清洗后的数据写入目标库表。',
        config: {
          datasource: 'db-main',
          operation: 'execute',
          statement:
            'INSERT INTO sync_records (id, payload, synced_at) VALUES (:id, :payload, :syncedAt)',
        },
      },
      {
        id: 'report',
        kind: 'message',
        name: '同步结果通知',
        description: '推送本次同步的条数与失败明细。',
        config: { channel: 'chat' },
      },
      {
        id: 'end',
        kind: 'end',
        name: '结束',
        description: '输出同步结果并结束流程。',
      },
    ],
    edges: [
      { source: 'start', target: 'fetch' },
      { source: 'fetch', target: 'transform' },
      { source: 'transform', target: 'persist' },
      { source: 'persist', target: 'report' },
      { source: 'report', target: 'end' },
    ],
  },
  {
    id: 'review',
    title: '内容审核流程',
    summary: '识别内容风险,命中风险转人工复核,通过后放行,驳回则说明原因。',
    keywords: [/审核/, /风控/, /合规/, /敏感/, /违规/, /质检/],
    nodes: [
      {
        id: 'start',
        kind: 'start',
        name: '接收待审内容',
        description: '接收待审核的文本或多媒体内容。',
        config: { trigger: 'api' },
      },
      {
        id: 'inspect',
        kind: 'llm',
        name: '风险识别',
        description: '识别违规、敏感与广告风险并输出风险等级。',
        config: {
          provider: 'llm-main',
          model: 'Doubao-pro-32k',
          systemPrompt:
            '识别内容中的违规、敏感与广告风险,输出风险等级与判定理由。',
          temperature: 0.1,
        },
      },
      {
        id: 'risk-check',
        kind: 'if-else',
        name: '是否命中风险',
        description: '按风险等级决定是否转人工复核。',
        config: { expression: 'inspect.riskLevel != "low"' },
      },
      {
        id: 'human-review',
        kind: 'approval',
        name: '人工复核',
        description: '命中风险的内容交内容审核员复核。',
        config: { assignee: 'role:content-moderator', timeoutHours: 12 },
      },
      {
        id: 'publish',
        kind: 'message',
        name: '审核通过并放行',
        description: '通知业务系统内容已通过审核。',
        config: { channel: 'chat' },
      },
      {
        id: 'reject',
        kind: 'message',
        name: '驳回并说明原因',
        description: '回传驳回原因与整改建议。',
        config: { channel: 'chat' },
      },
      {
        id: 'end',
        kind: 'end',
        name: '结束',
        description: '输出审核结论并结束流程。',
      },
    ],
    edges: [
      { source: 'start', target: 'inspect' },
      { source: 'inspect', target: 'risk-check' },
      {
        source: 'risk-check',
        target: 'human-review',
        sourcePort: 'true',
        label: '命中风险',
      },
      {
        source: 'risk-check',
        target: 'publish',
        sourcePort: 'false',
        label: '直接放行',
      },
      {
        source: 'human-review',
        target: 'publish',
        sourcePort: 'approved',
        label: '复核通过',
      },
      {
        source: 'human-review',
        target: 'reject',
        sourcePort: 'rejected',
        label: '复核驳回',
      },
      { source: 'publish', target: 'end' },
      { source: 'reject', target: 'end' },
    ],
  },
  {
    id: 'general',
    title: '通用处理流程',
    summary: '用大模型处理请求并输出结果,作为未命中具体场景时的兜底流程。',
    keywords: [/[\s\S]+/],
    nodes: [
      {
        id: 'start',
        kind: 'start',
        name: '接收请求',
        description: '接收本次流程的输入参数。',
        config: { trigger: 'manual' },
      },
      {
        id: 'process',
        kind: 'llm',
        name: '大模型处理',
        description: '按用户诉求完成理解、生成与整理。',
        config: {
          provider: 'llm-main',
          model: 'Doubao-pro-32k',
          systemPrompt: '按用户诉求完成处理,并输出可直接使用的结果。',
        },
      },
      {
        id: 'reply',
        kind: 'answer',
        name: '输出结果',
        description: '把处理结果输出给调用方。',
      },
      {
        id: 'end',
        kind: 'end',
        name: '结束',
        description: '输出结果并结束流程。',
      },
    ],
    edges: [
      { source: 'start', target: 'process' },
      { source: 'process', target: 'reply' },
      { source: 'reply', target: 'end' },
    ],
  },
]

/**
 * 提示词里提到、但模板缺失时的补充节点规则
 *
 * after-start 的规则在开始节点之后依次插入,before-end 的规则在结束节点之前依次插入
 */
export const workflowAiHints: WorkflowAiHint[] = [
  {
    id: 'knowledge',
    label: '补充知识库检索',
    pattern: /知识库|检索|文档|faq|资料库/,
    placement: 'after-start',
    coveredBy: ['knowledge'],
    nodes: [
      {
        id: 'hint-knowledge',
        kind: 'knowledge',
        name: '检索知识库',
        description: '召回与请求最相关的知识片段。',
        config: { knowledgeBase: 'kb-product', topK: 5, scoreThreshold: 0.6 },
      },
    ],
  },
  {
    id: 'http',
    label: '补充外部接口调用',
    pattern: /接口|api|http|外部系统|第三方/,
    placement: 'after-start',
    coveredBy: ['http', 'webhook'],
    nodes: [
      {
        id: 'hint-http',
        kind: 'http',
        name: '调用外部接口',
        description: '请求外部系统获取或提交数据。',
        config: {
          url: 'https://api.example.com/v1/action',
          method: 'POST',
        },
      },
    ],
  },
  {
    id: 'llm',
    label: '补充大模型处理',
    pattern: /大模型|llm|生成|摘要|总结|翻译|改写|抽取/,
    placement: 'after-start',
    coveredBy: ['llm', 'agent'],
    nodes: [
      {
        id: 'hint-llm',
        kind: 'llm',
        name: '大模型处理',
        description: '按提示词完成理解与生成。',
        config: {
          provider: 'llm-main',
          model: 'Doubao-pro-32k',
          systemPrompt: '依据输入完成生成任务,输出结构化结果。',
        },
      },
    ],
  },
  {
    id: 'database',
    label: '补充数据落库',
    pattern: /数据库|入库|落库|存表|持久化/,
    placement: 'before-end',
    coveredBy: ['database'],
    nodes: [
      {
        id: 'hint-database',
        kind: 'database',
        name: '写入数据表',
        description: '把处理结果写入业务库表。',
        config: {
          datasource: 'db-main',
          operation: 'execute',
          statement:
            'INSERT INTO workflow_records (id, payload) VALUES (:id, :payload)',
        },
      },
    ],
  },
  {
    id: 'human',
    label: '补充人工确认',
    pattern: /人工|复核|确认|会签/,
    placement: 'before-end',
    coveredBy: ['approval', 'human-input'],
    nodes: [
      {
        id: 'hint-human',
        kind: 'approval',
        name: '人工确认',
        description: '关键动作执行前等待人工确认。',
        config: { assignee: 'role:workflow-owner', timeoutHours: 24 },
      },
    ],
  },
  {
    id: 'notify',
    label: '补充结果通知',
    pattern: /通知|邮件|短信|提醒|告知|推送/,
    placement: 'before-end',
    coveredBy: ['message', 'answer'],
    nodes: [
      {
        id: 'hint-notify',
        kind: 'message',
        name: '发送结果通知',
        description: '把执行结果推送给相关人。',
        config: { channel: 'chat' },
      },
    ],
  },
]
