import {
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  DateRangePicker,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Rate,
  Select,
  Slider,
  Switch,
  TextArea,
  TimePicker,
  TreeSelect,
} from 'antdv-next'
import type { Component } from 'vue'
import type { FormPlusOption } from './types'

/**
 * 内置控件名,新增控件时与此处、BUILTIN_COMPONENTS 同步
 */
const BUILTIN_NAMES = [
  'input',
  'textarea',
  'inputNumber',
  'select',
  'checkbox',
  'checkboxGroup',
  'radio',
  'radioGroup',
  'switch',
  'datePicker',
  'dateRangePicker',
  'timePicker',
  'autoComplete',
  'cascader',
  'treeSelect',
  'slider',
  'rate',
] as const

type BuiltinName = (typeof BUILTIN_NAMES)[number]

/**
 * 内置控件表
 *
 * 使用 barrel 具名导入,与项目内 unplugin-vue-components 的解析方式保持一致
 */
export const BUILTIN_COMPONENTS: Record<BuiltinName, Component> = {
  input: Input,
  textarea: TextArea,
  inputNumber: InputNumber,
  select: Select,
  checkbox: Checkbox,
  checkboxGroup: CheckboxGroup,
  radio: Radio,
  radioGroup: RadioGroup,
  switch: Switch,
  datePicker: DatePicker,
  dateRangePicker: DateRangePicker,
  timePicker: TimePicker,
  autoComplete: AutoComplete,
  cascader: Cascader,
  treeSelect: TreeSelect,
  slider: Slider,
  rate: Rate,
}

/**
 * 需要以 checked 双向绑定的控件(其余控件统一使用 value)
 */
const CHECKED_BINDING_COMPONENTS = new Set<string>(['checkbox', 'switch'])

/**
 * 支持 options 属性的控件(需要把数据源透传给控件)
 */
const OPTION_COMPONENTS = new Set<string>([
  'select',
  'checkboxGroup',
  'radioGroup',
  'autoComplete',
  'cascader',
  'treeSelect',
])

/**
 * 懒加载选项时用于触发加载的控件事件
 *
 * key 取自内置控件名,写错会直接编译报错。
 */
const LAZY_TRIGGER_EVENTS: Partial<Record<BuiltinName, string[]>> = {
  select: ['dropdownVisibleChange', 'focus'],
  treeSelect: ['dropdownVisibleChange', 'focus'],
  autoComplete: ['dropdownVisibleChange', 'focus'],
  cascader: ['dropdownVisibleChange', 'focus'],
  datePicker: ['openChange', 'focus'],
  dateRangePicker: ['openChange', 'focus'],
  timePicker: ['openChange', 'focus'],
  checkboxGroup: ['focus'],
  radioGroup: ['focus'],
}

const registry = new Map<string, Component>()

/**
 * 判断控件名是否为内置控件
 *
 * @param name 控件名
 */
function isBuiltinName(name: string): name is BuiltinName {
  return (BUILTIN_NAMES as readonly string[]).includes(name)
}

/**
 * 全局注册自定义控件
 *
 * @param name 控件名,schema.component 使用该名字
 * @param component 组件实现
 */
export function registerFormComponent(name: string, component: Component) {
  registry.set(name, component)
}

/**
 * 取消全局注册
 *
 * @param name 控件名
 */
export function unregisterFormComponent(name: string) {
  registry.delete(name)
}

/**
 * 是否已注册该控件(含内置控件)
 *
 * @param name 控件名
 */
export function hasFormComponent(name: string) {
  return isBuiltinName(name) || registry.has(name)
}

/**
 * 解析控件名对应的组件
 *
 * 优先级:局部注册 > 全局注册 > 内置控件
 *
 * @param name 控件名
 * @param localComponents 局部注册表
 */
export function resolveFormComponent(
  name: string,
  localComponents?: Record<string, Component>
): Component | undefined {
  const builtin = isBuiltinName(name) ? BUILTIN_COMPONENTS[name] : undefined
  return localComponents?.[name] ?? registry.get(name) ?? builtin
}

/**
 * 判断控件是否以 checked 作为双向绑定字段
 *
 * @param name 控件名
 */
export function isCheckedBinding(name: string) {
  return CHECKED_BINDING_COMPONENTS.has(name)
}

/**
 * 判断控件是否需要透传 options
 *
 * @param name 控件名
 */
export function supportsOptions(name: string) {
  return OPTION_COMPONENTS.has(name)
}

/**
 * 获取懒加载选项时的触发事件名
 *
 * @param name 控件名
 */
export function getLazyTriggerEvents(name: string) {
  return (
    (isBuiltinName(name) ? LAZY_TRIGGER_EVENTS[name] : undefined) ?? ['focus']
  )
}

/**
 * 归一化控件属性
 *
 * 仅做必要兼容(clearable -> allowClear),schema 自身字段不会被透传。
 *
 * @param props 原始属性
 */
export function normalizeControlProps(props?: object): Record<string, unknown> {
  if (!props) return {}

  const { clearable, ...rest } = Object.fromEntries(Object.entries(props))
  if (clearable === undefined || rest.allowClear !== undefined) return rest

  return { ...rest, allowClear: clearable }
}

/**
 * 归一化选项数组,过滤掉非法项
 *
 * @param options 原始选项
 */
export function toFormOptions(options?: readonly unknown[]): FormPlusOption[] {
  if (!options?.length) return []

  return options.filter(
    (item): item is FormPlusOption =>
      typeof item === 'object' && item !== null && 'value' in item
  )
}

/**
 * 判断是否为 antdv 校验错误(替代仓库里多处重复实现)
 *
 * @param error 捕获到的异常
 */
export function isValidationError(
  error: unknown
): error is { errorFields: unknown[] } {
  return typeof error === 'object' && error !== null && 'errorFields' in error
}
