import type { FormInstance, FormProps, Rule } from 'antdv-next'
import type { Component } from 'vue'
import type { FormPlusContext } from './context'
import type { FormPlusCollapse, FormPlusGrid } from './layout'
import type {
  FormPlusModel,
  FormPlusOption,
  FormPlusOptionsState,
  FormPlusSchema,
  FormPlusSchemaBase,
  FormPlusValue,
} from './schema'

export interface FormPlusActionButton {
  /**
   * @desc 按钮文案
   */
  text: string
  /**
   * @desc 按钮图标,使用 lucide icon class
   */
  icon?: string
}

/**
 * 操作区配置
 */
export interface FormPlusActions {
  /**
   * @desc 是否渲染操作区
   * @default mode === 'query'
   */
  show?: boolean
  /**
   * @desc 查询/提交按钮,false 表示隐藏
   */
  submit?: { text?: string; icon?: string } | false
  /**
   * @desc 重置按钮
   */
  reset?: { text?: string; icon?: string } | false
  /**
   * @desc 展开/收缩按钮,仅在超出一屏可见数量时渲染
   * @default true
   */
  collapse?: boolean
}

export interface FormPlusProps {
  /**
   * @desc 表单项配置
   */
  schemas: readonly FormPlusSchema[]
  /**
   * @desc 受控模型,配合 v-model:model 使用;不传则由组件内部持有
   */
  model?: FormPlusModel
  /**
   * @desc 表单模式,query 默认渲染查询操作区
   * @default 'query'
   */
  mode?: 'query' | 'edit'
  /**
   * @desc 表单级校验规则,key 为字段名
   */
  rules?: Record<string, Rule[]>
  /**
   * @desc 整体禁用
   * @default false
   */
  disabled?: boolean
  /**
   * @desc 控件尺寸
   */
  size?: FormProps['size']
  /**
   * @desc 表单布局
   */
  layout?: FormProps['layout']
  /**
   * @desc 标签位置
   * @default 'left'
   */
  labelPlacement?: 'left' | 'top'
  /**
   * @desc 标签宽度,auto 表示自适应
   * @default 80
   */
  labelWidth?: number | 'auto'
  /**
   * @desc 标签栅格
   */
  labelCol?: FormProps['labelCol']
  /**
   * @desc 控件栅格
   */
  wrapperCol?: FormProps['wrapperCol']
  /**
   * @desc 是否显示冒号
   */
  colon?: boolean
  /**
   * @desc 校验触发时机
   */
  validateTrigger?: FormProps['validateTrigger']
  /**
   * @desc 校验失败时滚动到首个错误项
   */
  scrollToFirstError?: boolean | { focus?: boolean }
  /**
   * @desc 栅格布局配置,配置后按栅格渲染
   */
  grid?: FormPlusGrid
  /**
   * @desc 查询折叠配置,false 表示关闭折叠
   */
  collapse?: FormPlusCollapse | false
  /**
   * @desc 操作区配置
   */
  actions?: FormPlusActions
  /**
   * @desc 局部控件注册表,优先级高于全局注册表与内置控件
   */
  components?: Record<string, Component>
}

export interface FormPlusEmits {
  /**
   * @desc 模型变化,仅在使用 v-model:model 时触发
   */
  (e: 'update:model', model: FormPlusModel): void
  /**
   * @desc 校验通过后提交
   */
  (e: 'submit', values: FormPlusModel): void
  /**
   * @desc 重置表单
   */
  (e: 'reset'): void
  /**
   * @desc 字段值变化
   */
  (
    e: 'change',
    field: string,
    value: FormPlusValue,
    values: FormPlusModel
  ): void
  /**
   * @desc 折叠状态变化
   */
  (e: 'collapse-change', collapsed: boolean): void
  /**
   * @desc 校验失败
   */
  (e: 'validate-fail', error: unknown): void
  /**
   * @desc 选项加载失败
   */
  (e: 'options-error', field: string, error: unknown): void
}

/**
 * 自定义字段插槽属性
 */
export interface FormPlusFieldSlotProps {
  /**
   * @desc 字段配置
   */
  schema: FormPlusSchema
  /**
   * @desc 当前字段值
   */
  value: FormPlusValue
  /**
   * @desc 写入字段值
   */
  setValue: (value: FormPlusValue) => void
  /**
   * @desc 字段选项
   */
  options: FormPlusOption[]
  /**
   * @desc 选项是否加载中
   */
  loading: boolean
  /**
   * @desc 表单联动上下文
   */
  context: FormPlusContext
}

/**
 * 表单插槽
 */
export interface FormPlusSlots {
  /**
   * @desc 自定义整个表单内容
   */
  default?: () => unknown
  /**
   * @desc 自定义单个字段,由 schema.slot 命中
   */
  [slot: `field-${string}`]:
    | ((props: FormPlusFieldSlotProps) => unknown)
    | undefined
}

export interface FormPlusInstance {
  /**
   * @desc 校验通过后触发 submit
   */
  submit: () => Promise<void>
  /**
   * @desc 校验指定字段或整个表单
   */
  validate: (fields?: string[]) => Promise<void>
  /**
   * @desc 重置表单并清除校验
   */
  reset: () => void
  /**
   * @desc 清除校验状态
   */
  clearValidate: (fields?: string | string[]) => void
  /**
   * @desc 滚动到指定字段
   */
  scrollToField: (field: string) => void
  /**
   * @desc 获取全部字段值
   */
  getFieldsValue: () => FormPlusModel
  /**
   * @desc 获取单个字段值
   */
  getFieldValue: <T = FormPlusValue>(field: string) => T
  /**
   * @desc 批量设置字段值
   */
  setFieldsValue: (values: FormPlusModel) => void
  /**
   * @desc 设置单个字段值
   */
  setFieldValue: (field: string, value: FormPlusValue) => void
  /**
   * @desc 获取字段配置
   */
  getSchema: (field: string) => FormPlusSchema | undefined
  /**
   * @desc 动态修改字段配置
   */
  setSchema: (field: string, patch: Partial<FormPlusSchemaBase>) => void
  /**
   * @desc 显示字段
   */
  show: (field: string) => void
  /**
   * @desc 隐藏字段
   */
  hide: (field: string) => void
  /**
   * @desc 设置选项
   */
  setOptions: (field: string, options: FormPlusOption[]) => void
  /**
   * @desc 重新加载选项
   */
  reloadOptions: (field?: string) => Promise<void>
  /**
   * @desc 切换折叠状态
   */
  toggleCollapse: (value?: boolean) => void
  /**
   * @desc 是否处于折叠态
   *
   * 实例上的 ref 会被 Vue 解包,所以这里读到的已经是布尔值,不是 ComputedRef。
   */
  readonly isCollapsed: boolean
  /**
   * @desc 获取字段选项状态
   */
  getOptionsState: (field: string) => FormPlusOptionsState
  /**
   * @desc 获取 antdv FormInstance
   */
  getFormRef: () => FormInstance | undefined
}
