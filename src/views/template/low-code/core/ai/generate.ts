import { createNodeId } from '../schema'
import type { CreateNode } from './node'
import {
  createDashboardPageComponents,
  createDetailPageComponents,
  createFormPageComponents,
  createTablePageComponents,
} from './templates'
import type { AiField } from './templates'
import type { ComponentSchema } from '../schema/types'

/**
 * AI 生成结果的页面类型
 */
export type AiPageKind = 'dashboard' | 'detail' | 'form' | 'table'

/**
 * AI 生成方案
 */
export interface LowCodeAiPlan {
  /**
   * @desc 方案标识
   */
  id: string
  /**
   * @desc 识别出的页面类型
   */
  kind: AiPageKind
  /**
   * @desc 建议的页面标题
   */
  title: string
  /**
   * @desc 一句话说明本次生成的页面结构
   */
  summary: string
  /**
   * @desc 原始提示词
   */
  prompt: string
  /**
   * @desc 生成好的组件树，可直接替换当前页面
   */
  components: ComponentSchema[]
  /**
   * @desc 识别出的字段
   */
  fields: AiField[]
  /**
   * @desc 生成要点，便于用户核对
   */
  highlights: string[]
  /**
   * @desc 非阻断的提示
   */
  warnings: string[]
}

/**
 * 提示词模板
 */
export interface LowCodeAiSuggestion {
  id: string
  title: string
  icon: string
  prompt: string
}

interface FieldSpec extends AiField {
  pattern: RegExp
}

interface MetricSpec {
  label: string
  value: string
  suffix?: string
  pattern: RegExp
}

const FIELD_CATALOG: FieldSpec[] = [
  {
    key: 'username',
    label: '用户名',
    type: 'Input',
    pattern: /用户名|账号|账户/,
  },
  {
    key: 'password',
    label: '密码',
    type: 'Input',
    pattern: /密码/,
    props: { type: 'password' },
  },
  { key: 'email', label: '邮箱', type: 'Input', pattern: /邮箱|邮件/ },
  { key: 'phone', label: '手机号', type: 'Input', pattern: /手机|电话/ },
  { key: 'captcha', label: '验证码', type: 'Input', pattern: /验证码/ },
  { key: 'name', label: '姓名', type: 'Input', pattern: /姓名|名称|名字/ },
  { key: 'age', label: '年龄', type: 'InputNumber', pattern: /年龄/ },
  {
    key: 'gender',
    label: '性别',
    type: 'RadioGroup',
    pattern: /性别/,
    props: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    key: 'dept',
    label: '部门',
    type: 'Select',
    pattern: /部门|科室/,
    props: {
      options: ['研发', '产品', '设计', '运营'].map((label) => ({
        label,
        value: label,
      })),
    },
  },
  {
    key: 'role',
    label: '角色',
    type: 'Select',
    pattern: /角色|权限/,
    props: {
      options: ['管理员', '编辑', '访客'].map((label) => ({
        label,
        value: label,
      })),
    },
  },
  {
    key: 'status',
    label: '状态',
    type: 'Select',
    pattern: /状态/,
    props: {
      options: ['启用', '停用'].map((label) => ({ label, value: label })),
    },
  },
  { key: 'date', label: '日期', type: 'DatePicker', pattern: /日期|时间/ },
  {
    key: 'amount',
    label: '金额',
    type: 'InputNumber',
    pattern: /金额|价格|薪资/,
  },
  { key: 'remark', label: '备注', type: 'Textarea', pattern: /备注|说明|描述/ },
  { key: 'enabled', label: '是否启用', type: 'Switch', pattern: /启用|开关/ },
  {
    key: 'attachment',
    label: '附件',
    type: 'Upload',
    pattern: /附件|上传|图片/,
  },
]

const METRIC_CATALOG: MetricSpec[] = [
  {
    label: '销售额',
    value: '1,286,400',
    suffix: '元',
    pattern: /销售|营收|gmv/i,
  },
  { label: '订单量', value: '8,642', pattern: /订单/ },
  { label: '用户数', value: '42,180', pattern: /用户|会员/ },
  { label: '转化率', value: '32.6', suffix: '%', pattern: /转化|漏斗/ },
  { label: '访问量', value: '286,900', pattern: /访问|流量|pv/i },
  { label: '告警数', value: '18', pattern: /告警|异常/ },
  { label: '接口耗时', value: '186', suffix: 'ms', pattern: /耗时|延迟|性能/ },
  { label: '库存周转', value: '6.8', suffix: '次', pattern: /库存|周转/ },
]

const SUBJECTS = [
  '销售',
  '经营',
  '运营',
  '用户',
  '订单',
  '商品',
  '文章',
  '员工',
  '项目',
  '客户',
  '设备',
  '工单',
  '课程',
  '库存',
  '供应商',
  '合同',
  '财务',
]

const KIND_LABELS: Record<AiPageKind, string> = {
  dashboard: '数据看板',
  detail: '详情页',
  form: '表单页',
  table: '列表页',
}

export const lowCodeAiSuggestions: LowCodeAiSuggestion[] = [
  {
    id: 'user-table',
    title: '用户列表页',
    icon: 'i-lucide:table',
    prompt:
      '生成一个用户管理列表页，包含姓名、角色、状态、创建日期和备注，顶部带搜索筛选',
  },
  {
    id: 'login-form',
    title: '登录表单',
    icon: 'i-lucide:log-in',
    prompt: '生成一个登录页面，用户名、密码、记住我、提交按钮',
  },
  {
    id: 'order-dashboard',
    title: '经营看板',
    icon: 'i-lucide:layout-dashboard',
    prompt: '生成销售经营看板，包含销售额、订单量、用户数、转化率和访问量指标',
  },
  {
    id: 'employee-form',
    title: '员工录入表单',
    icon: 'i-lucide:clipboard-list',
    prompt:
      '生成员工信息录入表单，包含姓名、部门、角色、年龄、手机号、入职日期和备注',
  },
  {
    id: 'contract-detail',
    title: '合同详情页',
    icon: 'i-lucide:file-text',
    prompt: '生成合同详情页，展示合同名称、客户、金额、状态和签署日期',
  },
]

function inferKind(prompt: string): AiPageKind {
  if (/看板|大屏|仪表盘|概览|监控|指标|dashboard/i.test(prompt)) {
    return 'dashboard'
  }
  if (/详情|明细|查看详情|detail/i.test(prompt)) return 'detail'
  if (/登录|注册|sign\s?in|sign\s?up|login/i.test(prompt)) return 'form'
  if (/列表|表格|管理|查询|table|list|crud/i.test(prompt)) return 'table'
  if (/表单|录入|填写|新建|编辑|提交|form/i.test(prompt)) return 'form'
  return 'form'
}

function inferSubject(prompt: string) {
  return SUBJECTS.find((subject) => prompt.includes(subject)) ?? '业务'
}

function inferTitle(prompt: string, kind: AiPageKind, subject: string) {
  if (/登录/.test(prompt)) return '登录'
  if (/注册/.test(prompt)) return '注册'
  return `${subject}${KIND_LABELS[kind]}`
}

function matchFields(prompt: string): AiField[] {
  return FIELD_CATALOG.filter((field) => field.pattern.test(prompt)).map(
    ({ pattern: _pattern, ...field }) => field
  )
}

function matchMetrics(prompt: string): AiField[] {
  const matched = METRIC_CATALOG.filter((metric) => metric.pattern.test(prompt))
  const metrics = matched.length
    ? matched
    : METRIC_CATALOG.filter((metric) =>
        /销售|经营|运营/.test(prompt) ? true : metric.label === '用户数'
      )
  return metrics.map((metric) => ({
    key: metric.label,
    label: metric.label,
    type: 'Statistic',
    props: { value: metric.value, suffix: metric.suffix },
  }))
}

function defaultFields(kind: AiPageKind): AiField[] {
  if (kind === 'dashboard') return matchMetrics('用户数')
  return FIELD_CATALOG.filter((field) =>
    ['name', 'role', 'status', 'remark'].includes(field.key)
  ).map(({ pattern: _pattern, ...field }) => field)
}

/**
 * 根据自然语言提示词生成低代码页面方案
 *
 * 目前采用内置规则与模板匹配（项目未接入大模型接口），
 * 生成结果与手工搭建完全一致，可直接写入 Schema 并由真实 Runtime 渲染。
 *
 * @param prompt 用户输入的自然语言描述
 * @param createNode 物料节点工厂，由设计器提供
 * @returns 生成方案
 */
export function generateLowCodePlan(
  prompt: string,
  createNode: CreateNode
): LowCodeAiPlan {
  const text = prompt.trim()
  const kind = inferKind(text)
  const subject = inferSubject(text)
  const title = inferTitle(text, kind, subject)
  const warnings: string[] = []

  let fields = matchFields(text)
  if (kind === 'dashboard') {
    fields = matchMetrics(text)
  } else if (!fields.length) {
    fields = defaultFields(kind)
    warnings.push(
      '未识别到具体字段，已按通用字段生成，可在右侧属性面板继续调整'
    )
  }

  const description = `由 AI 根据「${text.slice(0, 24)}${text.length > 24 ? '…' : ''}」生成，可继续手工编辑`

  const components =
    kind === 'dashboard'
      ? createDashboardPageComponents(createNode, title, description, fields)
      : kind === 'table'
        ? createTablePageComponents(createNode, title, description, fields, {
            filters: fields.slice(0, 2),
          })
        : kind === 'detail'
          ? createDetailPageComponents(createNode, title, description, fields)
          : createFormPageComponents(createNode, title, description, fields)

  if (kind === 'dashboard' && /图|折线|柱状|饼图|趋势/.test(text)) {
    warnings.push('低代码物料暂未内置图表组件，已用指标卡与明细表格占位')
  }

  const highlights = [
    `页面类型：${KIND_LABELS[kind]}`,
    `字段/指标：${fields.map((field) => field.label).join('、') || '无'}`,
    `结构：标题区 + ${
      kind === 'table'
        ? '筛选区 + 表格'
        : kind === 'dashboard'
          ? '指标卡 + 趋势 + 明细'
          : kind === 'detail'
            ? '详情字段'
            : '表单卡片'
    }`,
  ]

  return {
    id: createNodeId('ai-plan'),
    kind,
    title,
    summary: `已识别为「${KIND_LABELS[kind]}」，生成 ${components.length} 个根节点、${fields.length} 个字段`,
    prompt: text,
    components,
    fields,
    highlights,
    warnings,
  }
}
