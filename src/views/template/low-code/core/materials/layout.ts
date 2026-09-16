import { Card, Form, FormItem } from 'antdv-next'
import { computed, defineComponent, h, provide, reactive } from 'vue'
import type { PropType, Ref } from 'vue'
import { FORM_CONTEXT_KEY } from '../runtime/keys'
import {
  flexStyle,
  gridStyle,
  layoutStyle,
  nameField,
  rulesField,
  selectField,
  switchField,
  textField,
  textareaField,
} from './helpers'
import type { ComponentDefinition } from '../schema/types'

/** 纯布局容器：本身不产生 DOM，样式由节点包装层承载 */
const SlotOutlet = defineComponent({
  name: 'LcSlotOutlet',
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

const CardRenderer = defineComponent({
  name: 'LcCard',
  inheritAttrs: false,
  props: {
    title: { type: String, default: '' },
    extra: { type: String, default: '' },
    bordered: { type: Boolean, default: true },
    hoverable: { type: Boolean, default: false },
    size: { type: String as PropType<'default' | 'small'>, default: 'default' },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        Card,
        {
          ...attrs,
          title: props.title || undefined,
          bordered: props.bordered,
          hoverable: props.hoverable,
          size: props.size,
        },
        {
          default: () => slots.default?.(),
          extra: props.extra ? () => h('span', props.extra) : undefined,
        }
      )
  },
})

const FormRenderer = defineComponent({
  name: 'LcForm',
  inheritAttrs: false,
  props: {
    layout: {
      type: String as PropType<'horizontal' | 'vertical' | 'inline'>,
      default: 'vertical',
    },
    labelAlign: {
      type: String as PropType<'left' | 'right'>,
      default: 'right',
    },
    colon: { type: Boolean, default: true },
    requiredMark: { type: Boolean, default: true },
    model: {
      type: Object as PropType<Record<string, unknown>>,
      default: undefined,
    },
  },
  emits: ['finish', 'finishFailed'],
  setup(props, { slots, emit, attrs }) {
    const internalModel = reactive<Record<string, unknown>>({})
    const model = computed(() => props.model ?? internalModel)
    provide(FORM_CONTEXT_KEY, {
      model: model as Ref<Record<string, unknown>>,
    })
    return () =>
      h(
        Form,
        {
          ...attrs,
          layout: props.layout,
          labelAlign: props.labelAlign,
          colon: props.colon,
          requiredMark: props.requiredMark,
          model: model.value,
          onFinish: (values: unknown) => emit('finish', values),
          onFinishFailed: (errorInfo: unknown) =>
            emit('finishFailed', errorInfo),
        },
        { default: () => slots.default?.() }
      )
  },
})

const FormItemRenderer = defineComponent({
  name: 'LcFormItem',
  inheritAttrs: false,
  props: {
    label: { type: String, default: '' },
    name: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
    required: { type: Boolean, default: false },
    help: { type: String, default: '' },
    extra: { type: String, default: '' },
    validateStatus: {
      type: String as PropType<'success' | 'warning' | 'error' | 'validating'>,
      default: undefined,
    },
    rules: { type: Array as PropType<unknown[]>, default: undefined },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        FormItem,
        {
          ...attrs,
          label: props.label || undefined,
          name: props.name,
          required: props.required,
          help: props.help || undefined,
          extra: props.extra || undefined,
          validateStatus: props.validateStatus,
          rules: props.rules as never,
        },
        { default: () => slots.default?.() }
      )
  },
})

export const layoutMaterialDefinitions: ComponentDefinition[] = [
  {
    type: 'Block',
    title: '区块容器',
    description: '基础流式布局容器，按顺序排列子组件',
    category: '布局',
    icon: 'i-lucide:square-dashed',
    kind: 1,
    acceptsChildren: true,
    props: [],
    events: [],
    defaultProps: {},
    defaultStyle: { ...layoutStyle },
    tips: ['布局方式（Block/Flex/Grid/自由布局）在「样式」面板中配置'],
    renderer: SlotOutlet,
  },
  {
    type: 'Flex',
    title: '弹性布局',
    description: 'Flex 容器，支持横向/纵向与对齐方式',
    category: '布局',
    icon: 'i-lucide:move-horizontal',
    kind: 1,
    acceptsChildren: true,
    props: [],
    events: [],
    defaultProps: {},
    defaultStyle: { ...flexStyle },
    tips: ['方向 / 对齐 / 间距在「样式」面板中配置'],
    renderer: SlotOutlet,
  },
  {
    type: 'Grid',
    title: '栅格布局',
    description: 'Grid 容器，等宽多列排布子组件',
    category: '布局',
    icon: 'i-lucide:grid-2x2',
    kind: 1,
    acceptsChildren: true,
    props: [],
    events: [],
    defaultProps: {},
    defaultStyle: { ...gridStyle },
    tips: ['列数 / 间距在「样式」面板中配置，子组件可设置栅格跨度'],
    renderer: SlotOutlet,
  },
  {
    type: 'Card',
    title: '卡片',
    description: '带标题/操作区的卡片容器',
    category: '布局',
    icon: 'i-lucide:square',
    kind: 1,
    acceptsChildren: true,
    props: [
      textField('title', '标题'),
      textField('extra', '右上角文案'),
      switchField('bordered', '显示边框'),
      switchField('hoverable', '悬浮效果'),
      selectField('size', '尺寸', [
        { label: '默认', value: 'default' },
        { label: '紧凑', value: 'small' },
      ]),
    ],
    events: [],
    defaultProps: {
      title: '卡片标题',
      bordered: true,
      hoverable: false,
      size: 'default',
    },
    defaultStyle: { width: '100%' },
    renderer: CardRenderer,
  },
  {
    type: 'Form',
    title: '表单',
    description: '表单容器，内部控件按字段名自动双向绑定',
    category: '布局',
    icon: 'i-lucide:clipboard-list',
    kind: 1,
    acceptsChildren: true,
    allowedChildren: ['FormItem', 'Flex', 'Grid', 'Block', 'Divider'],
    props: [
      selectField('layout', '布局方式', [
        { label: '纵向', value: 'vertical' },
        { label: '横向', value: 'horizontal' },
        { label: '行内', value: 'inline' },
      ]),
      selectField('labelAlign', '标签对齐', [
        { label: '左对齐', value: 'left' },
        { label: '右对齐', value: 'right' },
      ]),
      switchField('colon', '显示冒号'),
      switchField('requiredMark', '显示必填标记'),
    ],
    events: [
      { name: 'finish', label: '校验通过' },
      { name: 'finishFailed', label: '校验失败' },
    ],
    defaultProps: {
      layout: 'vertical',
      labelAlign: 'right',
      colon: true,
      requiredMark: true,
    },
    defaultStyle: { ...flexStyle, padding: '16px' },
    renderer: FormRenderer,
  },
  {
    type: 'FormItem',
    title: '表单项',
    description: '表单字段容器，提供标签与校验',
    category: '布局',
    icon: 'i-lucide:list-todo',
    kind: 1,
    acceptsChildren: true,
    allowedChildren: [
      'Input',
      'Textarea',
      'InputNumber',
      'Select',
      'RadioGroup',
      'Checkbox',
      'CheckboxGroup',
      'Switch',
      'Slider',
      'Rate',
      'DatePicker',
      'TimePicker',
      'Upload',
    ],
    props: [
      textField('label', '标签'),
      nameField(),
      switchField('required', '必填'),
      textareaField('help', '帮助提示'),
      textareaField('extra', '额外说明'),
      rulesField(),
    ],
    events: [],
    defaultProps: { label: '字段', required: false },
    defaultStyle: { width: '100%' },
    renderer: FormItemRenderer,
  },
]

export { CardRenderer, FormItemRenderer, FormRenderer, SlotOutlet }
