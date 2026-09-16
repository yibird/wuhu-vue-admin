import { WORKFLOW_DSL_VERSION } from './types'
import type {
  JsonValue,
  WorkflowDataSchema,
  WorkflowNodeCategory,
  WorkflowNodeConfigFieldSchema,
  WorkflowNodeDefinition,
  WorkflowNodeKind,
  WorkflowNodePortSchema,
} from './types'

const anySchema: WorkflowDataSchema = { type: 'any' }
const stringSchema: WorkflowDataSchema = { type: 'string' }
const objectSchema: WorkflowDataSchema = {
  type: 'object',
  additionalProperties: true,
}
const arraySchema: WorkflowDataSchema = {
  type: 'array',
  items: anySchema,
}

function input(
  id: string,
  label: string,
  schema: WorkflowDataSchema = anySchema,
  required = false
): WorkflowNodePortSchema {
  return { id, label, schema, required }
}

function output(
  id: string,
  label: string,
  schema: WorkflowDataSchema = anySchema
): WorkflowNodePortSchema {
  return { id, label, schema }
}

function field(
  key: string,
  label: string,
  control: WorkflowNodeConfigFieldSchema['control'],
  schema: WorkflowDataSchema,
  options: Partial<WorkflowNodeConfigFieldSchema> = {}
): WorkflowNodeConfigFieldSchema {
  return { key, label, control, schema, ...options }
}

interface DefinitionOptions {
  kind: WorkflowNodeKind
  category: WorkflowNodeCategory
  title: string
  description: string
  icon: string
  accent: string
  gradient?: [string, string]
  inputs?: WorkflowNodePortSchema[]
  outputs?: WorkflowNodePortSchema[]
  config?: WorkflowNodeConfigFieldSchema[]
  defaults?: Record<string, JsonValue>
  executable?: boolean
  sideEffect?: boolean
  supportsRetry?: boolean
  palette?: boolean
}

/** 各节点的品牌渐变（起始色 → 结束色） */
const nodeGradients: Record<WorkflowNodeKind, [string, string]> = {
  start: ['#2563eb', '#06b6d4'],
  end: ['#16a34a', '#84cc16'],
  variable: ['#64748b', '#94a3b8'],
  'set-variable': ['#475569', '#0ea5e9'],
  llm: ['#4f46e5', '#c026d3'],
  agent: ['#7c3aed', '#2563eb'],
  tool: ['#0ea5e9', '#8b5cf6'],
  'question-classifier': ['#8b5cf6', '#ec4899'],
  'parameter-extractor': ['#6366f1', '#14b8a6'],
  embedding: ['#6366f1', '#06b6d4'],
  rerank: ['#8b5cf6', '#f43f5e'],
  http: ['#0284c7', '#22d3ee'],
  database: ['#0f766e', '#14b8a6'],
  code: ['#059669', '#84cc16'],
  file: ['#0f766e', '#0ea5e9'],
  'document-extractor': ['#0d9488', '#6366f1'],
  'template-transform': ['#0891b2', '#8b5cf6'],
  'variable-aggregator': ['#0ea5e9', '#22c55e'],
  'list-operator': ['#14b8a6', '#eab308'],
  knowledge: ['#0891b2', '#6366f1'],
  'if-else': ['#d97706', '#facc15'],
  switch: ['#ca8a04', '#f97316'],
  condition: ['#d97706', '#ef4444'],
  loop: ['#9333ea', '#6366f1'],
  iterator: ['#9333ea', '#0ea5e9'],
  parallel: ['#ea580c', '#f59e0b'],
  subflow: ['#0d9488', '#2563eb'],
  'workflow-input': ['#0d9488', '#22c55e'],
  'workflow-output': ['#0d9488', '#14b8a6'],
  approval: ['#e11d48', '#f97316'],
  'human-input': ['#db2777', '#8b5cf6'],
  delay: ['#ca8a04', '#64748b'],
  plugin: ['#dc2626', '#f97316'],
  webhook: ['#2563eb', '#8b5cf6'],
  message: ['#db2777', '#0ea5e9'],
  answer: ['#06b6d4', '#4f46e5'],
}

function defineNode(options: DefinitionOptions): WorkflowNodeDefinition {
  return {
    version: WORKFLOW_DSL_VERSION,
    inputs: [],
    outputs: [],
    config: [],
    defaults: {},
    gradient: nodeGradients[options.kind],
    executable: true,
    sideEffect: false,
    supportsRetry: true,
    palette: true,
    ...options,
  }
}

const definitions: WorkflowNodeDefinition[] = [
  defineNode({
    kind: 'start',
    category: 'basic',
    title: '开始',
    description: '声明工作流入口并注入运行输入。',
    icon: 'i-lucide:play-circle',
    accent: '#2563eb',
    outputs: [
      output('input', '流程输入', objectSchema),
      output('query', '查询文本', stringSchema),
    ],
    config: [
      field('trigger', '触发方式', 'select', stringSchema, {
        options: [
          { label: '手动运行', value: 'manual' },
          { label: 'API 调用', value: 'api' },
        ],
      }),
    ],
    defaults: { trigger: 'manual' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'end',
    category: 'basic',
    title: '结束',
    description: '结束执行并生成工作流输出。',
    icon: 'i-lucide:circle-stop',
    accent: '#16a34a',
    inputs: [input('result', '最终结果', anySchema, true)],
    supportsRetry: false,
  }),
  defineNode({
    kind: 'variable',
    category: 'basic',
    title: '变量',
    description: '读取工作流、环境或密钥变量。',
    icon: 'i-lucide:variable',
    accent: '#64748b',
    outputs: [output('value', '变量值')],
    config: [
      field('variable', '变量标识', 'input', stringSchema, { required: true }),
    ],
    defaults: { variable: '' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'set-variable',
    category: 'basic',
    title: '设置变量',
    description: '以显式赋值策略更新可变工作流变量。',
    icon: 'i-lucide:braces',
    accent: '#475569',
    inputs: [input('value', '变量值', anySchema, true)],
    outputs: [output('value', '更新后的值')],
    config: [
      field('variable', '变量标识', 'input', stringSchema, { required: true }),
    ],
    defaults: { variable: '' },
    sideEffect: true,
    supportsRetry: false,
  }),
  defineNode({
    kind: 'llm',
    category: 'ai',
    title: '大语言模型',
    description: '调用大语言模型完成生成、分类或抽取。',
    icon: 'i-lucide:sparkles',
    accent: '#4f46e5',
    inputs: [
      input('prompt', '提示词', stringSchema, true),
      input('context', '上下文', arraySchema),
    ],
    outputs: [
      output('text', '生成文本', stringSchema),
      output('usage', 'Token 用量', objectSchema),
    ],
    config: [
      field('provider', '模型资源', 'resource', stringSchema, {
        required: true,
        resourceType: 'llm-provider',
      }),
      field('model', '模型', 'input', stringSchema, { required: true }),
      field('systemPrompt', '系统提示词', 'textarea', stringSchema),
      field('temperature', '随机性', 'number', {
        type: 'number',
        default: 0.7,
      }),
      field('maxTokens', '最大 Token', 'number', {
        type: 'integer',
        default: 2048,
      }),
    ],
    defaults: {
      provider: 'llm-main',
      model: 'Doubao-pro-32k',
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 2048,
    },
  }),
  defineNode({
    kind: 'agent',
    category: 'ai',
    title: 'AI 智能体',
    description: '规划步骤、调用工具并汇总执行结果。',
    icon: 'i-lucide:bot',
    accent: '#7c3aed',
    inputs: [
      input('task', '任务', stringSchema, true),
      input('context', '上下文', objectSchema),
    ],
    outputs: [
      output('result', '执行结果'),
      output('trace', '推理轨迹', arraySchema),
    ],
    config: [
      field('model', '模型', 'input', stringSchema, { required: true }),
      field('maxSteps', '最大步骤', 'number', { type: 'integer', default: 8 }),
    ],
    defaults: { model: 'Doubao-pro-32k', maxSteps: 8 },
  }),
  defineNode({
    kind: 'tool',
    category: 'ai',
    title: '工具调用',
    description: '调用函数工具或 OpenAPI 能力完成外部操作。',
    icon: 'i-lucide:wrench',
    accent: '#0ea5e9',
    inputs: [
      input('arguments', '调用参数', objectSchema),
      input('context', '上下文', objectSchema),
    ],
    outputs: [
      output('result', '调用结果'),
      output('error', '错误信息', stringSchema),
    ],
    config: [
      field('tool', '工具资源', 'resource', stringSchema, {
        required: true,
        resourceType: 'tool',
      }),
      field('arguments', '参数绑定', 'json', objectSchema, { required: true }),
      field('timeoutMs', '超时时间', 'number', {
        type: 'integer',
        default: 15000,
      }),
    ],
    defaults: { tool: '', arguments: {}, timeoutMs: 15000 },
    sideEffect: true,
  }),
  defineNode({
    kind: 'question-classifier',
    category: 'ai',
    title: '问题分类器',
    description: '使用模型识别输入意图并按分类路由分支。',
    icon: 'i-lucide:list-tree',
    accent: '#8b5cf6',
    inputs: [input('query', '待分类文本', stringSchema, true)],
    outputs: [
      output('matched', '命中分类', objectSchema),
      output('fallback', '未命中分类', objectSchema),
    ],
    config: [
      field('model', '模型', 'input', stringSchema, { required: true }),
      field(
        'classes',
        '分类定义',
        'json',
        { type: 'array', items: objectSchema },
        { required: true }
      ),
      field('instruction', '分类指令', 'textarea', stringSchema),
    ],
    defaults: { model: 'Doubao-pro-32k', classes: [], instruction: '' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'parameter-extractor',
    category: 'ai',
    title: '参数提取器',
    description: '按 Schema 从文本中提取结构化参数。',
    icon: 'i-lucide:scan-text',
    accent: '#6366f1',
    inputs: [input('text', '原始文本', stringSchema, true)],
    outputs: [
      output('parameters', '提取结果', objectSchema),
      output('missing', '缺失字段', arraySchema),
    ],
    config: [
      field('model', '模型', 'input', stringSchema, { required: true }),
      field(
        'parameters',
        '参数定义',
        'json',
        { type: 'array', items: objectSchema },
        { required: true }
      ),
      field('instruction', '提取指令', 'textarea', stringSchema),
    ],
    defaults: { model: 'Doubao-pro-32k', parameters: [], instruction: '' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'embedding',
    category: 'ai',
    title: '向量化',
    description: '将文本或文档转换为向量表示。',
    icon: 'i-lucide:binary',
    accent: '#6366f1',
    inputs: [
      input('texts', '文本集合', { type: 'array', items: stringSchema }, true),
    ],
    outputs: [
      output('vectors', '向量集合', {
        type: 'array',
        items: { type: 'vector' },
      }),
    ],
    config: [
      field('model', '向量模型', 'input', stringSchema, { required: true }),
      field('dimensions', '向量维度', 'number', {
        type: 'integer',
        default: 1024,
      }),
    ],
    defaults: { model: 'bge-m3', dimensions: 1024 },
  }),
  defineNode({
    kind: 'rerank',
    category: 'ai',
    title: '重排序',
    description: '根据查询语义重新排序候选文档。',
    icon: 'i-lucide:list-filter',
    accent: '#8b5cf6',
    inputs: [
      input('query', '查询', stringSchema, true),
      input('documents', '候选文档', arraySchema, true),
    ],
    outputs: [output('documents', '排序文档', arraySchema)],
    config: [
      field('model', '重排模型', 'input', stringSchema, { required: true }),
      field('topK', '返回数量', 'number', { type: 'integer', default: 5 }),
    ],
    defaults: { model: 'bge-reranker-v2-m3', topK: 5 },
  }),
  defineNode({
    kind: 'http',
    category: 'data',
    title: 'HTTP 请求',
    description: '通过受控凭证请求外部 HTTP 服务。',
    icon: 'i-lucide:send',
    accent: '#0284c7',
    inputs: [
      input('query', '查询参数', objectSchema),
      input('body', '请求体', anySchema),
    ],
    outputs: [
      output('response', '响应体'),
      output('status', '状态码', { type: 'integer' }),
    ],
    config: [
      field('url', '请求地址', 'input', stringSchema, { required: true }),
      field('method', '请求方法', 'select', stringSchema, {
        options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((value) => ({
          label: value,
          value,
        })),
      }),
      field('credential', '认证资源', 'resource', stringSchema, {
        resourceType: 'http-credential',
      }),
      field('timeoutMs', '超时时间', 'number', {
        type: 'integer',
        default: 10000,
      }),
    ],
    defaults: { url: '', method: 'GET', credential: '', timeoutMs: 10000 },
    sideEffect: true,
  }),
  defineNode({
    kind: 'database',
    category: 'data',
    title: '数据库',
    description: '使用数据源资源执行参数化查询或写入。',
    icon: 'i-lucide:database',
    accent: '#0f766e',
    inputs: [input('parameters', '查询参数', objectSchema)],
    outputs: [
      output('rows', '结果集', arraySchema),
      output('affectedRows', '影响行数', { type: 'integer' }),
    ],
    config: [
      field('datasource', '数据源', 'resource', stringSchema, {
        required: true,
        resourceType: 'database',
      }),
      field('operation', '操作', 'select', stringSchema, {
        options: [
          { label: '查询', value: 'query' },
          { label: '执行', value: 'execute' },
        ],
      }),
      field('statement', '参数化语句', 'code', stringSchema, {
        required: true,
      }),
    ],
    defaults: { datasource: '', operation: 'query', statement: '' },
    sideEffect: true,
  }),
  defineNode({
    kind: 'code',
    category: 'data',
    title: '代码',
    description: '在隔离运行环境中转换数据。',
    icon: 'i-lucide:code-2',
    accent: '#059669',
    inputs: [input('input', '输入', anySchema)],
    outputs: [output('result', '执行结果')],
    config: [
      field('language', '语言', 'select', stringSchema, {
        options: [
          { label: 'JavaScript', value: 'javascript' },
          { label: 'Python', value: 'python' },
        ],
      }),
      field('source', '代码', 'code', stringSchema, { required: true }),
    ],
    defaults: { language: 'javascript', source: 'return input' },
  }),
  defineNode({
    kind: 'file',
    category: 'data',
    title: '文件',
    description: '读取、解析或写入受控文件资源。',
    icon: 'i-lucide:file-cog',
    accent: '#0f766e',
    inputs: [input('file', '文件', { type: 'file' }, true)],
    outputs: [
      output('content', '文件内容'),
      output('metadata', '文件信息', objectSchema),
    ],
    config: [
      field('operation', '操作', 'select', stringSchema, {
        options: [
          { label: '读取', value: 'read' },
          { label: '解析', value: 'parse' },
          { label: '写入', value: 'write' },
        ],
      }),
      field('storage', '文件存储', 'resource', stringSchema, {
        resourceType: 'file-storage',
      }),
    ],
    defaults: { operation: 'read', storage: '' },
    sideEffect: true,
  }),
  defineNode({
    kind: 'document-extractor',
    category: 'data',
    title: '文档提取',
    description: '解析文档资源并提取纯文本与元数据。',
    icon: 'i-lucide:file-text',
    accent: '#0d9488',
    inputs: [input('file', '文档', { type: 'file' }, true)],
    outputs: [
      output('text', '文本内容', stringSchema),
      output('metadata', '文档信息', objectSchema),
    ],
    config: [
      field('storage', '文件存储', 'resource', stringSchema, {
        resourceType: 'file-storage',
      }),
      field('maxCharacters', '最大字符数', 'number', {
        type: 'integer',
        default: 20000,
      }),
    ],
    defaults: { storage: '', maxCharacters: 20000 },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'template-transform',
    category: 'data',
    title: '模板转换',
    description: '按模板拼接变量并输出渲染文本。',
    icon: 'i-lucide:file-code-2',
    accent: '#0891b2',
    inputs: [input('variables', '模板变量', objectSchema)],
    outputs: [output('text', '渲染结果', stringSchema)],
    config: [
      field('template', '模板内容', 'code', stringSchema, { required: true }),
    ],
    defaults: { template: '' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'variable-aggregator',
    category: 'data',
    title: '变量聚合',
    description: '把多个分支的结果聚合为统一输出。',
    icon: 'i-lucide:combine',
    accent: '#0ea5e9',
    inputs: [input('values', '候选值', arraySchema, true)],
    outputs: [output('value', '聚合结果')],
    config: [
      field('strategy', '聚合策略', 'select', stringSchema, {
        options: [
          { label: '首个非空值', value: 'first-non-null' },
          { label: '合并为数组', value: 'array' },
          { label: '合并对象', value: 'merge' },
        ],
      }),
    ],
    defaults: { strategy: 'first-non-null' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'list-operator',
    category: 'data',
    title: '列表操作',
    description: '对数组执行过滤、排序、切片等转换。',
    icon: 'i-lucide:arrow-up-down',
    accent: '#14b8a6',
    inputs: [input('items', '数组', arraySchema, true)],
    outputs: [
      output('items', '结果数组', arraySchema),
      output('count', '数量', { type: 'integer' }),
    ],
    config: [
      field('operation', '操作类型', 'select', stringSchema, {
        options: [
          { label: '过滤', value: 'filter' },
          { label: '排序', value: 'sort' },
          { label: '截取', value: 'limit' },
          { label: '去重', value: 'unique' },
          { label: '反转', value: 'reverse' },
        ],
      }),
      field('expression', '操作表达式', 'expression', stringSchema),
      field('limit', '截取数量', 'number', { type: 'integer', default: 10 }),
    ],
    defaults: { operation: 'filter', expression: 'item != null', limit: 10 },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'knowledge',
    category: 'data',
    title: '知识库',
    description: '从指定知识库召回相关文档片段。',
    icon: 'i-lucide:book-open-text',
    accent: '#0891b2',
    inputs: [input('query', '查询', stringSchema, true)],
    outputs: [
      output('chunks', '文档片段', {
        type: 'array',
        items: { type: 'document' },
      }),
    ],
    config: [
      field('knowledgeBase', '知识库', 'resource', stringSchema, {
        required: true,
        resourceType: 'knowledge-base',
      }),
      field('topK', '召回数量', 'number', { type: 'integer', default: 5 }),
      field('scoreThreshold', '最低相关度', 'number', {
        type: 'number',
        default: 0.6,
      }),
    ],
    defaults: { knowledgeBase: 'kb-product', topK: 5, scoreThreshold: 0.6 },
  }),
  defineNode({
    kind: 'if-else',
    category: 'logic',
    title: '条件分支',
    description: '按布尔表达式选择 true 或 false 分支。',
    icon: 'i-lucide:git-fork',
    accent: '#d97706',
    inputs: [input('value', '判断值', anySchema, true)],
    outputs: [
      output('true', '真分支', { type: 'boolean' }),
      output('false', '假分支', { type: 'boolean' }),
    ],
    config: [
      field('expression', '判断表达式', 'expression', stringSchema, {
        required: true,
      }),
    ],
    defaults: { expression: 'value != null' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'switch',
    category: 'logic',
    title: '多路分支',
    description: '按照离散值匹配多个分支。',
    icon: 'i-lucide:split',
    accent: '#ca8a04',
    inputs: [input('value', '匹配值', anySchema, true)],
    outputs: [output('matched', '匹配分支'), output('default', '默认分支')],
    config: [
      field(
        'cases',
        '分支规则',
        'json',
        { type: 'array', items: objectSchema },
        { required: true }
      ),
    ],
    defaults: { cases: [] },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'condition',
    category: 'logic',
    title: '条件判断',
    description: '组合多条规则并输出匹配结果。',
    icon: 'i-lucide:list-checks',
    accent: '#d97706',
    inputs: [input('context', '判断上下文', objectSchema, true)],
    outputs: [
      output('matched', '匹配', { type: 'boolean' }),
      output('unmatched', '未匹配', { type: 'boolean' }),
    ],
    config: [
      field('operator', '组合方式', 'select', stringSchema, {
        options: [
          { label: '全部满足', value: 'and' },
          { label: '任一满足', value: 'or' },
        ],
      }),
      field(
        'rules',
        '规则',
        'json',
        { type: 'array', items: objectSchema },
        { required: true }
      ),
    ],
    defaults: { operator: 'and', rules: [] },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'loop',
    category: 'logic',
    title: '循环',
    description: '按条件重复执行循环体并限制最大次数。',
    icon: 'i-lucide:repeat',
    accent: '#9333ea',
    inputs: [input('state', '循环状态', objectSchema, true)],
    outputs: [output('body', '循环体'), output('done', '循环完成')],
    config: [
      field('condition', '继续条件', 'expression', stringSchema, {
        required: true,
      }),
      field('maxIterations', '最大次数', 'number', {
        type: 'integer',
        default: 100,
      }),
    ],
    defaults: { condition: 'state.continue == true', maxIterations: 100 },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'iterator',
    category: 'logic',
    title: '迭代器',
    description: '遍历集合并控制单项处理并发度。',
    icon: 'i-lucide:repeat-2',
    accent: '#9333ea',
    inputs: [input('items', '集合', arraySchema, true)],
    outputs: [
      output('item', '当前项'),
      output('results', '处理结果', arraySchema),
    ],
    config: [
      field('concurrency', '并发数量', 'number', {
        type: 'integer',
        default: 1,
      }),
      field('continueOnError', '失败后继续', 'switch', {
        type: 'boolean',
        default: false,
      }),
    ],
    defaults: { concurrency: 1, continueOnError: false },
  }),
  defineNode({
    kind: 'parallel',
    category: 'logic',
    title: '并行',
    description: '并发启动多个下游分支并按策略汇合。',
    icon: 'i-lucide:git-branch',
    accent: '#ea580c',
    inputs: [input('input', '输入')],
    outputs: [
      output('branches', '并行分支'),
      output('results', '聚合结果', arraySchema),
    ],
    config: [
      field('completion', '完成策略', 'select', stringSchema, {
        options: [
          { label: '全部完成', value: 'all' },
          { label: '任一完成', value: 'any' },
        ],
      }),
      field('maxConcurrency', '最大并发', 'number', {
        type: 'integer',
        default: 4,
      }),
    ],
    defaults: { completion: 'all', maxConcurrency: 4 },
  }),
  defineNode({
    kind: 'subflow',
    category: 'workflow',
    title: '子工作流',
    description: '调用已发布的工作流版本。',
    icon: 'i-lucide:network',
    accent: '#0d9488',
    inputs: [input('input', '子流程输入', objectSchema)],
    outputs: [output('output', '子流程输出', objectSchema)],
    config: [
      field('workflow', '目标工作流', 'resource', stringSchema, {
        required: true,
        resourceType: 'sub-workflow',
      }),
      field('version', '版本策略', 'input', stringSchema, { required: true }),
      field('waitForResult', '等待结果', 'switch', {
        type: 'boolean',
        default: true,
      }),
    ],
    defaults: {
      workflow: '',
      version: 'latest-published',
      waitForResult: true,
    },
    sideEffect: true,
  }),
  defineNode({
    kind: 'workflow-input',
    category: 'workflow',
    title: '工作流输入',
    description: '将工作流接口输入映射到局部节点。',
    icon: 'i-lucide:log-in',
    accent: '#0d9488',
    outputs: [output('value', '输入值')],
    config: [
      field('input', '输入字段', 'input', stringSchema, { required: true }),
    ],
    defaults: { input: '' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'workflow-output',
    category: 'workflow',
    title: '工作流输出',
    description: '将节点结果写入工作流接口输出。',
    icon: 'i-lucide:log-out',
    accent: '#0d9488',
    inputs: [input('value', '输出值', anySchema, true)],
    config: [
      field('output', '输出字段', 'input', stringSchema, { required: true }),
    ],
    defaults: { output: '' },
    supportsRetry: false,
  }),
  defineNode({
    kind: 'approval',
    category: 'human',
    title: '人工审批',
    description: '暂停运行并等待人工审批决策。',
    icon: 'i-lucide:user-round-check',
    accent: '#e11d48',
    inputs: [input('request', '审批内容', objectSchema, true)],
    outputs: [
      output('approved', '通过', objectSchema),
      output('rejected', '拒绝', objectSchema),
    ],
    config: [
      field('assignee', '审批人', 'input', stringSchema, { required: true }),
      field('timeoutHours', '超时小时', 'number', {
        type: 'integer',
        default: 24,
      }),
    ],
    defaults: { assignee: 'workflow-owner', timeoutHours: 24 },
    sideEffect: true,
    supportsRetry: false,
  }),
  defineNode({
    kind: 'human-input',
    category: 'human',
    title: '人工输入',
    description: '暂停运行并等待用户补充结构化输入。',
    icon: 'i-lucide:message-square-input',
    accent: '#db2777',
    inputs: [input('prompt', '输入提示', stringSchema, true)],
    outputs: [output('response', '用户输入'), output('timeout', '超时分支')],
    config: [
      field('formSchema', '表单 Schema', 'json', objectSchema, {
        required: true,
      }),
      field('timeoutHours', '超时小时', 'number', {
        type: 'integer',
        default: 24,
      }),
    ],
    defaults: { formSchema: {}, timeoutHours: 24 },
    sideEffect: true,
    supportsRetry: false,
  }),
  defineNode({
    kind: 'delay',
    category: 'integration',
    title: '延迟',
    description: '等待指定时长后继续执行。',
    icon: 'i-lucide:timer',
    accent: '#ca8a04',
    inputs: [input('input', '输入')],
    outputs: [output('output', '输出')],
    config: [
      field('durationMs', '等待毫秒', 'number', {
        type: 'integer',
        default: 1000,
      }),
    ],
    defaults: { durationMs: 1000 },
    palette: false,
  }),
  defineNode({
    kind: 'plugin',
    category: 'integration',
    title: '插件',
    description: '调用已注册的扩展插件。',
    icon: 'i-lucide:puzzle',
    accent: '#dc2626',
    inputs: [input('input', '输入')],
    outputs: [output('output', '输出')],
    config: [
      field('pluginId', '插件标识', 'input', stringSchema, { required: true }),
    ],
    defaults: { pluginId: '' },
    sideEffect: true,
    palette: false,
  }),
  defineNode({
    kind: 'webhook',
    category: 'integration',
    title: '回调通知',
    description: '发送带签名的回调事件。',
    icon: 'i-lucide:webhook',
    accent: '#2563eb',
    inputs: [input('payload', '事件数据', objectSchema)],
    outputs: [output('response', '响应')],
    config: [field('url', '地址', 'input', stringSchema, { required: true })],
    defaults: { url: '' },
    sideEffect: true,
    palette: false,
  }),
  defineNode({
    kind: 'message',
    category: 'integration',
    title: '消息',
    description: '发送渠道消息。',
    icon: 'i-lucide:message-square-send',
    accent: '#db2777',
    inputs: [input('content', '消息内容', stringSchema, true)],
    outputs: [output('messageId', '消息标识', stringSchema)],
    config: [
      field('channel', '渠道', 'input', stringSchema, { required: true }),
    ],
    defaults: { channel: 'chat' },
    sideEffect: true,
    palette: false,
  }),
  defineNode({
    kind: 'answer',
    category: 'integration',
    title: '直接回复',
    description: '向用户流式输出最终答案并结束当前分支。',
    icon: 'i-lucide:message-circle',
    accent: '#06b6d4',
    inputs: [input('content', '回复内容', stringSchema, true)],
    outputs: [output('messageId', '消息标识', stringSchema)],
    config: [
      field('format', '输出格式', 'select', stringSchema, {
        options: [
          { label: 'Markdown', value: 'markdown' },
          { label: '纯文本', value: 'text' },
        ],
      }),
    ],
    defaults: { format: 'markdown' },
    sideEffect: true,
    supportsRetry: false,
  }),
]

const definitionMap = new Map(
  definitions.map((definition) => [definition.kind, definition])
)

export const workflowNodeDefinitions = definitions

export function getWorkflowNodeDefinition(kind: WorkflowNodeKind) {
  return definitionMap.get(kind)
}

export function requireWorkflowNodeDefinition(kind: WorkflowNodeKind) {
  const definition = getWorkflowNodeDefinition(kind)
  if (!definition) throw new Error(`未注册的工作流节点：${kind}`)
  return definition
}

export function isWorkflowNodeKind(value: unknown): value is WorkflowNodeKind {
  return (
    typeof value === 'string' && definitionMap.has(value as WorkflowNodeKind)
  )
}

export function areWorkflowDataSchemasCompatible(
  source: WorkflowDataSchema,
  target: WorkflowDataSchema
) {
  if (source.type === 'any' || target.type === 'any') return true
  if (source.type === target.type) return true
  return source.type === 'integer' && target.type === 'number'
}
