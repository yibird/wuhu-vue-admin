import {
  numberField,
  optionsField,
  selectField,
  textField,
  type AnyControlDefinition,
} from './controlUtils.ts'

const commonStyle = {
  density: 'comfortable',
  gridColumn: 6,
  tone: 'neutral',
} as const

const fullStyle = {
  density: 'comfortable',
  gridColumn: 12,
  tone: 'neutral',
} as const

export const basicControlDefinitions = [
  {
    type: 'flex',
    category: 'basic',
    title: 'Flex 容器',
    description: '可嵌套控件的弹性布局容器。',
    icon: 'i-lucide:panel-top-open',
    badge: '容器',
    acceptsChildren: true,
    defaultProps: {
      align: 'stretch',
      direction: 'row',
      gap: 12,
      justify: 'start',
    },
    defaultStyle: { ...fullStyle, tone: 'neutral' },
    fields: [
      selectField('direction', '方向', [
        { label: '横向', value: 'row' },
        { label: '纵向', value: 'column' },
      ]),
      selectField('justify', '主轴对齐', [
        { label: '起始', value: 'start' },
        { label: '居中', value: 'center' },
        { label: '末尾', value: 'end' },
        { label: '两端', value: 'between' },
      ]),
      selectField('align', '交叉轴对齐', [
        { label: '起始', value: 'start' },
        { label: '居中', value: 'center' },
        { label: '末尾', value: 'end' },
        { label: '拉伸', value: 'stretch' },
      ]),
      numberField('gap', '间距'),
    ],
  },
  {
    type: 'hero',
    category: 'basic',
    title: '首屏容器',
    description: '标题、指标、按钮和说明文案。',
    icon: 'i-lucide:panel-top',
    defaultProps: { badge: 'Low Code Workspace', buttonText: 'Launch' },
    defaultStyle: { density: 'spacious', gridColumn: 12, tone: 'primary' },
    fields: [textField('badge', '徽标'), textField('buttonText', '按钮文案')],
  },
  {
    type: 'form',
    category: 'basic',
    title: '业务表单',
    description: '输入项、选择器和提交操作。',
    icon: 'i-lucide:clipboard-list',
    defaultProps: { fields: ['客户名称', '来源渠道', '预计预算', '跟进人'] },
    defaultStyle: { ...commonStyle, columns: 2 },
    fields: [optionsField('fields', '字段列表')],
  },
  {
    type: 'notice',
    category: 'basic',
    title: '运营提醒',
    description: '通知、风险、待办和告警。',
    icon: 'i-lucide:bell-dot',
    defaultProps: { icon: 'i-lucide:bell-dot' },
    defaultStyle: { density: 'compact', gridColumn: 12, tone: 'warning' },
    fields: [textField('icon', '图标')],
  },
] satisfies readonly AnyControlDefinition[]

export const dataControlDefinitions = [
  {
    type: 'stats',
    category: 'data',
    title: '指标网格',
    description: '多列 KPI 和趋势标签。',
    icon: 'i-lucide:badge-percent',
    defaultProps: { items: ['转化率', '有效客户', '成交金额', '自动化任务'] },
    defaultStyle: { ...fullStyle, columns: 4 },
    fields: [optionsField('items', '指标项')],
  },
  {
    type: 'table',
    category: 'data',
    title: '数据列表',
    description: '轻量列表、状态和负责人。',
    icon: 'i-lucide:table-2',
    defaultProps: { rows: ['需求评审', '合同审批', '交付排期'] },
    defaultStyle: fullStyle,
    fields: [optionsField('rows', '行标题')],
  },
  {
    type: 'chart',
    category: 'data',
    title: '趋势分析',
    description: '趋势柱状图和增长洞察。',
    icon: 'i-lucide:chart-no-axes-combined',
    defaultProps: { bars: [40, 74, 55, 92, 68, 108, 86, 124] },
    defaultStyle: { ...commonStyle, tone: 'primary' },
    fields: [optionsField('bars', '柱状数据')],
  },
] satisfies readonly AnyControlDefinition[]
