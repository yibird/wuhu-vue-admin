import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  InputNumber,
  RadioGroup,
  Rate,
  Select,
  Slider,
  Switch,
  TextArea,
  Upload,
} from 'antdv-next'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import type { Component } from 'vue'
import { Icon } from '@/components'
import {
  controlStyle,
  nameField,
  numberField,
  optionsField,
  selectField,
  switchField,
  textField,
  textareaField,
  staticOptions,
} from './helpers'
import type { ComponentDefinition } from '../schema/types'

/** 轻量转发：把解析后的 props/事件直接透传给 antdv 组件 */
function forward(name: string, component: Component) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(component, attrs, slots)
    },
  })
}

const InputRenderer = forward('LcInput', Input)
const TextareaRenderer = forward('LcTextarea', TextArea)
const InputNumberRenderer = forward('LcInputNumber', InputNumber)
const SelectRenderer = forward('LcSelect', Select)
const RadioGroupRenderer = forward('LcRadioGroup', RadioGroup)
const CheckboxRenderer = forward('LcCheckbox', Checkbox)
const CheckboxGroupRenderer = forward('LcCheckboxGroup', CheckboxGroup)
const SwitchRenderer = forward('LcSwitch', Switch)
const SliderRenderer = forward('LcSlider', Slider)
const RateRenderer = forward('LcRate', Rate)
const UploadRenderer = forward('LcUpload', Upload)

const DatePickerRenderer = defineAsyncComponent(async () => {
  const module = await import('antdv-next')
  return forward('LcDatePicker', module.DatePicker)
})

const TimePickerRenderer = defineAsyncComponent(async () => {
  const module = await import('antdv-next')
  return forward('LcTimePicker', module.TimePicker)
})

const ButtonRenderer = defineComponent({
  name: 'LcButton',
  inheritAttrs: false,
  props: {
    text: { type: String, default: '按钮' },
    icon: { type: String, default: '' },
    type: { type: String, default: 'default' },
    danger: { type: Boolean, default: false },
    size: { type: String, default: 'middle' },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    htmlType: { type: String, default: 'button' },
  },
  setup(props, { attrs, emit }) {
    return () =>
      h(
        Button,
        {
          ...attrs,
          type: props.type as never,
          danger: props.danger,
          size: props.size as never,
          block: props.block,
          loading: props.loading,
          disabled: props.disabled,
          htmlType: props.htmlType as never,
          onClick: (event: MouseEvent) => emit('click', event),
        },
        {
          default: () => [
            props.icon
              ? h(Icon, {
                  key: 'icon',
                  name: props.icon,
                  size: 15,
                  class: 'mr-6',
                })
              : null,
            props.text,
          ],
        }
      )
  },
})

export const controlMaterialDefinitions: ComponentDefinition[] = [
  {
    type: 'Input',
    title: '输入框',
    description: '单行文本输入',
    category: '基础控件',
    icon: 'i-lucide:text-cursor-input',
    kind: 0,
    props: [
      nameField(),
      textField('placeholder', '占位提示'),
      textField('value', '默认值'),
      switchField('allowClear', '允许清空'),
      switchField('disabled', '禁用'),
      numberField('maxlength', '最大长度', { min: 0 }),
      selectField('size', '尺寸', staticOptions(['small', 'middle', 'large'])),
    ],
    events: [
      { name: 'change', label: '内容变化' },
      { name: 'pressEnter', label: '回车' },
      { name: 'focus', label: '聚焦' },
      { name: 'blur', label: '失焦' },
    ],
    defaultProps: {
      placeholder: '请输入内容',
      value: '',
      allowClear: true,
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: InputRenderer,
  },
  {
    type: 'Textarea',
    title: '多行文本',
    description: '多行文本输入与备注',
    category: '基础控件',
    icon: 'i-lucide:align-left',
    kind: 0,
    props: [
      nameField(),
      textField('placeholder', '占位提示'),
      textareaField('value', '默认值'),
      numberField('rows', '行数', { min: 1, max: 20, defaultValue: 4 }),
      numberField('maxlength', '最大长度', { min: 0 }),
      switchField('allowClear', '允许清空'),
      switchField('disabled', '禁用'),
    ],
    events: [
      { name: 'change', label: '内容变化' },
      { name: 'focus', label: '聚焦' },
      { name: 'blur', label: '失焦' },
    ],
    defaultProps: {
      placeholder: '请输入内容',
      value: '',
      rows: 4,
      allowClear: true,
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: TextareaRenderer,
  },
  {
    type: 'InputNumber',
    title: '数字输入',
    description: '金额、数量、比例输入',
    category: '基础控件',
    icon: 'i-lucide:circle-dollar-sign',
    kind: 0,
    props: [
      nameField(),
      numberField('value', '默认值'),
      numberField('min', '最小值'),
      numberField('max', '最大值'),
      numberField('step', '步长', { defaultValue: 1 }),
      numberField('precision', '小数位', { min: 0, max: 6 }),
      textField('placeholder', '占位提示'),
      switchField('disabled', '禁用'),
    ],
    events: [
      { name: 'change', label: '数值变化' },
      { name: 'focus', label: '聚焦' },
      { name: 'blur', label: '失焦' },
    ],
    defaultProps: {
      value: undefined,
      min: undefined,
      max: undefined,
      step: 1,
      placeholder: '请输入数字',
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: InputNumberRenderer,
  },
  {
    type: 'Select',
    title: '下拉选择',
    description: '枚举、状态、成员选择',
    category: '基础控件',
    icon: 'i-lucide:list-filter',
    kind: 0,
    props: [
      nameField(),
      selectField('mode', '选择模式', [
        { label: '单选', value: 'default' },
        { label: '多选', value: 'multiple' },
        { label: '标签', value: 'tags' },
      ]),
      optionsField(),
      textField('placeholder', '占位提示'),
      switchField('allowClear', '允许清空'),
      switchField('showSearch', '允许搜索'),
      switchField('disabled', '禁用'),
    ],
    events: [
      { name: 'change', label: '选中变化' },
      { name: 'search', label: '搜索' },
      { name: 'clear', label: '清空' },
    ],
    defaultProps: {
      mode: 'default',
      options: staticOptions(['待处理', '进行中', '已完成']),
      placeholder: '请选择',
      value: undefined,
      allowClear: true,
      showSearch: false,
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: SelectRenderer,
  },
  {
    type: 'RadioGroup',
    title: '单选组',
    description: '少量可见选项的单选',
    category: '基础控件',
    icon: 'i-lucide:list-checks',
    kind: 0,
    props: [
      nameField(),
      optionsField(),
      selectField('optionType', '选项样式', [
        { label: '默认', value: 'default' },
        { label: '按钮', value: 'button' },
      ]),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '选中变化' }],
    defaultProps: {
      optionType: 'default',
      options: staticOptions(['选项一', '选项二', '选项三']),
      value: undefined,
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: RadioGroupRenderer,
  },
  {
    type: 'Checkbox',
    title: '复选框',
    description: '单个布尔勾选',
    category: '基础控件',
    icon: 'i-lucide:square-check',
    kind: 0,
    props: [
      nameField(),
      textField('label', '文案'),
      switchField('checked', '默认选中'),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '选中变化' }],
    defaultProps: { label: '同意相关条款', checked: false },
    defaultStyle: { width: 'auto' },
    model: { prop: 'checked', event: 'update:checked' },
    renderer: CheckboxRenderer,
  },
  {
    type: 'CheckboxGroup',
    title: '多选组',
    description: '多选项批量勾选',
    category: '基础控件',
    icon: 'i-lucide:list-plus',
    kind: 0,
    props: [nameField(), optionsField(), switchField('disabled', '禁用')],
    events: [{ name: 'change', label: '选中变化' }],
    defaultProps: {
      options: staticOptions(['选项一', '选项二', '选项三']),
      value: [],
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: CheckboxGroupRenderer,
  },
  {
    type: 'Switch',
    title: '开关',
    description: '布尔状态切换',
    category: '基础控件',
    icon: 'i-lucide:toggle-right',
    kind: 0,
    props: [
      nameField(),
      switchField('checked', '默认开启'),
      textField('checkedText', '开启文案'),
      textField('uncheckedText', '关闭文案'),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '状态变化' }],
    defaultProps: { checked: false },
    defaultStyle: { width: 'auto' },
    model: { prop: 'checked', event: 'update:checked' },
    renderer: SwitchRenderer,
  },
  {
    type: 'Slider',
    title: '滑动输入',
    description: '数值区间滑动选择',
    category: '基础控件',
    icon: 'i-lucide:sliders-horizontal',
    kind: 0,
    props: [
      nameField(),
      numberField('value', '默认值', { min: 0, max: 100 }),
      numberField('min', '最小值', { defaultValue: 0 }),
      numberField('max', '最大值', { defaultValue: 100 }),
      numberField('step', '步长', { defaultValue: 1 }),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '数值变化' }],
    defaultProps: { value: 30, min: 0, max: 100, step: 1 },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: SliderRenderer,
  },
  {
    type: 'Rate',
    title: '评分',
    description: '星级评分输入',
    category: '基础控件',
    icon: 'i-lucide:star',
    kind: 0,
    props: [
      nameField(),
      numberField('value', '默认分值', { min: 0, max: 10 }),
      numberField('count', '星级数量', { min: 1, max: 10, defaultValue: 5 }),
      switchField('allowHalf', '允许半星'),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '分值变化' }],
    defaultProps: { value: 0, count: 5, allowHalf: false },
    defaultStyle: { width: 'auto' },
    model: { prop: 'value', event: 'update:value' },
    renderer: RateRenderer,
  },
  {
    type: 'DatePicker',
    title: '日期选择',
    description: '日期/日期时间选择',
    category: '基础控件',
    icon: 'i-lucide:calendar',
    kind: 0,
    props: [
      nameField(),
      selectField('picker', '选择类型', [
        { label: '日期', value: 'date' },
        { label: '月份', value: 'month' },
        { label: '年份', value: 'year' },
      ]),
      switchField('showTime', '显示时间'),
      textField('placeholder', '占位提示'),
      textField('valueFormat', '值格式', {
        description: 'value 绑定的字符串格式，如 YYYY-MM-DD',
      }),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '日期变化' }],
    defaultProps: {
      picker: 'date',
      showTime: false,
      placeholder: '请选择日期',
      valueFormat: 'YYYY-MM-DD',
      value: undefined,
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: DatePickerRenderer,
  },
  {
    type: 'TimePicker',
    title: '时间选择',
    description: '时间点选择',
    category: '基础控件',
    icon: 'i-lucide:clock',
    kind: 0,
    props: [
      nameField(),
      textField('placeholder', '占位提示'),
      textField('valueFormat', '值格式'),
      switchField('disabled', '禁用'),
    ],
    events: [{ name: 'change', label: '时间变化' }],
    defaultProps: {
      placeholder: '请选择时间',
      valueFormat: 'HH:mm:ss',
      value: undefined,
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'value', event: 'update:value' },
    renderer: TimePickerRenderer,
  },
  {
    type: 'Upload',
    title: '上传',
    description: '文件上传',
    category: '基础控件',
    icon: 'i-lucide:upload-cloud',
    kind: 0,
    props: [
      nameField(),
      textField('action', '上传地址'),
      textField('accept', '文件类型'),
      switchField('multiple', '允许多选'),
      selectField('listType', '列表样式', [
        { label: '文本', value: 'text' },
        { label: '图片', value: 'picture' },
        { label: '图片卡片', value: 'picture-card' },
      ]),
      numberField('maxCount', '最大数量', { min: 1 }),
      switchField('disabled', '禁用'),
    ],
    events: [
      { name: 'change', label: '文件变化' },
      { name: 'remove', label: '移除文件' },
    ],
    defaultProps: {
      action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
      listType: 'text',
      multiple: false,
      maxCount: 3,
      fileList: [],
    },
    defaultStyle: { ...controlStyle },
    model: { prop: 'fileList', event: 'update:fileList' },
    renderer: UploadRenderer,
  },
  {
    type: 'Button',
    title: '按钮',
    description: '触发操作与事件',
    category: '基础控件',
    icon: 'i-lucide:mouse-pointer-click',
    kind: 0,
    props: [
      textField('text', '按钮文案'),
      iconFieldCompat(),
      selectField('type', '按钮类型', [
        { label: '默认', value: 'default' },
        { label: '主要', value: 'primary' },
        { label: '虚线', value: 'dashed' },
        { label: '文本', value: 'text' },
        { label: '链接', value: 'link' },
      ]),
      switchField('danger', '危险操作'),
      selectField('size', '尺寸', [
        { label: '小', value: 'small' },
        { label: '中', value: 'middle' },
        { label: '大', value: 'large' },
      ]),
      switchField('block', '撑满宽度'),
      switchField('loading', '加载中'),
      switchField('disabled', '禁用'),
      selectField('htmlType', '原生类型', [
        { label: 'button', value: 'button' },
        { label: 'submit', value: 'submit' },
        { label: 'reset', value: 'reset' },
      ]),
    ],
    events: [{ name: 'click', label: '点击' }],
    defaultProps: {
      text: '按钮',
      type: 'primary',
      danger: false,
      block: false,
      loading: false,
      disabled: false,
      htmlType: 'button',
    },
    defaultStyle: { width: 'auto' },
    renderer: ButtonRenderer,
  },
]

function iconFieldCompat() {
  return {
    key: 'icon',
    label: '图标',
    type: 'icon' as const,
    placeholder: 'i-lucide:plus',
  }
}
