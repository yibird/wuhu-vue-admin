import type { FormInstance } from 'antdv-next'
import type {
  FormPlusModel,
  FormPlusOption,
  FormPlusOptionsState,
  FormPlusSchema,
  FormPlusSchemaBase,
  FormPlusValue,
} from './schema'

export interface FormPlusContext {
  /**
   * @desc 当前模型(实时对象,只读类型)
   */
  readonly model: FormPlusModel
  /**
   * @desc 获取全部字段值(浅拷贝)
   */
  getValues: () => FormPlusModel
  /**
   * @desc 获取指定字段值
   */
  getValue: <T = FormPlusValue>(field: string) => T
  /**
   * @desc 设置指定字段值,并触发联动派发
   */
  setValue: (field: string, value: FormPlusValue) => void
  /**
   * @desc 批量设置字段值
   */
  setValues: (values: FormPlusModel) => void
  /**
   * @desc 获取指定字段的 schema 配置
   */
  getSchema: (field: string) => FormPlusSchema | undefined
  /**
   * @desc 动态修改指定字段的 schema 配置(显隐、禁用、属性、标签、规则、选项等)
   */
  setSchema: (field: string, patch: Partial<FormPlusSchemaBase>) => void
  /**
   * @desc 字段当前是否显示
   */
  isVisible: (field: string) => boolean
  /**
   * @desc 显示字段
   */
  show: (field: string) => void
  /**
   * @desc 隐藏字段
   */
  hide: (field: string) => void
  /**
   * @desc 设置字段显隐
   */
  setVisible: (field: string, visible: boolean) => void
  /**
   * @desc 字段当前是否禁用
   */
  isDisabled: (field: string) => boolean
  /**
   * @desc 设置字段禁用状态
   */
  setDisabled: (field: string, disabled: boolean) => void
  /**
   * @desc 获取字段的选项加载状态
   */
  getOptionsState: (field: string) => FormPlusOptionsState
  /**
   * @desc 直接写入字段选项(常用于联动刷新从表数据源)
   */
  setOptions: (field: string, options: FormPlusOption[]) => void
  /**
   * @desc 重新加载选项,不传则重新加载全部
   */
  reloadOptions: (field?: string) => Promise<void>
  /**
   * @desc 校验指定字段或整个表单,失败时抛出 antdv 的校验错误
   */
  validate: (fields?: string[]) => Promise<void>
  /**
   * @desc 清除校验状态
   */
  clearValidate: (fields?: string | string[]) => void
  /**
   * @desc 滚动到指定字段
   */
  scrollToField: (field: string) => void
  /**
   * @desc 查询表单折叠状态
   */
  readonly collapsed: Readonly<Ref<boolean>>
  /**
   * @desc 切换折叠状态
   */
  toggleCollapse: (value?: boolean) => void
  /**
   * @desc antdv FormInstance,用于未封装的场景(未挂载时为 null)
   */
  readonly formRef: Readonly<ShallowRef<FormInstance | null | undefined>>
}

/**
 * 栅格断点,与 antd Col 的响应式 props 一致
 */
