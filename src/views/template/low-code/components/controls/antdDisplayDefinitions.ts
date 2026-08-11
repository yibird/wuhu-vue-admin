import {
  booleanField,
  numberField,
  selectField,
  tableColumns,
  tableRows,
  textField,
  textareaField,
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

export const antdDisplayDefinitions = [
  {
    type: 'button',
    category: 'antd',
    title: 'Button',
    description: '主按钮、次按钮和危险按钮。',
    icon: 'i-lucide:mouse-pointer-click',
    badge: 'Antdv',
    defaultProps: {
      block: false,
      danger: false,
      label: '提交表单',
      type: 'primary',
    },
    defaultStyle: { density: 'compact', gridColumn: 6, tone: 'primary' },
    fields: [
      textField('label', '按钮文案'),
      selectField('type', '按钮类型', [
        { label: '默认', value: 'default' },
        { label: '主按钮', value: 'primary' },
        { label: '虚线', value: 'dashed' },
      ]),
      booleanField('danger', '危险按钮'),
      booleanField('block', '占满宽度'),
    ],
  },
  {
    type: 'card',
    category: 'antd',
    title: 'Card',
    description: '卡片容器，可嵌套子组件。',
    icon: 'i-lucide:panel-top-open',
    badge: '容器',
    acceptsChildren: true,
    defaultProps: {
      content: '用于承载信息块、详情和操作集合。',
      extra: '详情',
    },
    defaultStyle: commonStyle,
    fields: [textareaField('content', '内容'), textField('extra', '扩展操作')],
  },
  {
    type: 'alert',
    category: 'antd',
    title: 'Alert',
    description: '结果提示、风险提示和系统状态。',
    icon: 'i-lucide:badge-alert',
    badge: 'Antdv',
    defaultProps: {
      message: '请关注待审批风险项',
      showIcon: true,
      type: 'warning',
    },
    defaultStyle: fullStyle,
    fields: [
      textField('message', '提示文案'),
      selectField('type', '提示类型', [
        { label: '成功', value: 'success' },
        { label: '信息', value: 'info' },
        { label: '警告', value: 'warning' },
        { label: '错误', value: 'error' },
      ]),
      booleanField('showIcon', '显示图标'),
    ],
  },
  {
    type: 'progress',
    category: 'antd',
    title: 'Progress',
    description: '进度、完成率和处理状态。',
    icon: 'i-lucide:activity',
    badge: 'Antdv',
    defaultProps: { percent: 68, status: 'active' },
    defaultStyle: commonStyle,
    fields: [
      numberField('percent', '进度'),
      selectField('status', '状态', [
        { label: '默认', value: 'normal' },
        { label: '进行中', value: 'active' },
        { label: '异常', value: 'exception' },
        { label: '成功', value: 'success' },
      ]),
    ],
  },
  {
    type: 'tag',
    category: 'antd',
    title: 'Tag',
    description: '状态标签、分类和筛选标识。',
    icon: 'i-lucide:tag',
    badge: 'Antdv',
    defaultProps: { color: 'blue', label: '进行中' },
    defaultStyle: { density: 'compact', gridColumn: 4, tone: 'primary' },
    fields: [textField('label', '标签'), textField('color', '颜色')],
  },
  {
    type: 'dataTable',
    category: 'antd',
    title: 'Table',
    description: '表格、列配置和行操作。',
    icon: 'i-lucide:table-properties',
    badge: 'Antdv',
    defaultProps: { columns: tableColumns, rows: tableRows },
    defaultStyle: fullStyle,
    fields: [],
  },
] satisfies readonly AnyControlDefinition[]
