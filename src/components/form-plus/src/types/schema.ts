import type {
  AutoCompleteProps,
  CascaderProps,
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  FormItemProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  RadioProps,
  RangePickerProps,
  RateProps,
  Rule,
  SelectProps,
  SliderProps,
  SwitchProps,
  TextAreaProps,
  TimePickerProps,
  TreeSelectProps,
} from 'antdv-next'
import type { FormPlusContext } from './context'

/**
 * 内置控件名到组件 props 类型的映射
 *
 * 通过 `declare module '@/components/form-plus'` 合并可扩展自定义控件，
 * 键名需与组件注册名一致（全局 registerFormComponent 或局部 components 传入）。
 */
export interface FormPlusComponentPropsMap {
  input: InputProps
  textarea: TextAreaProps
  inputNumber: InputNumberProps
  select: WithFormOptions<SelectProps>
  checkbox: CheckboxProps
  checkboxGroup: WithFormOptions<CheckboxGroupProps>
  radio: RadioProps
  radioGroup: WithFormOptions<RadioGroupProps>
  switch: SwitchProps
  datePicker: DatePickerProps
  dateRangePicker: RangePickerProps
  timePicker: TimePickerProps
  autoComplete: WithFormOptions<AutoCompleteProps>
  cascader: WithFormOptions<CascaderProps>
  treeSelect: WithFormOptions<TreeSelectProps>
  slider: SliderProps
  rate: RateProps
}

/**
 * 把控件的 options 放宽为 FormPlusOption
 *
 * antd 的 SelectProps['options'] 只允许 string | number 值,
 * 实际业务里常用布尔等类型的值(例如状态开关),因此这里只放宽 options 一个字段。
 */
type WithFormOptions<T> = Omit<T, 'options'> & { options?: FormPlusOption[] }

/**
 * 内置控件名
 */
export type FormPlusComponentName = keyof FormPlusComponentPropsMap

/**
 * 表单字段值
 */
export type FormPlusValue = unknown

/**
 * 表单模型,key 为字段名
 */
export type FormPlusModel = Record<string, FormPlusValue>

/**
 * 下拉类控件的选项
 */
export interface FormPlusOption {
  /**
   * @desc 选项值,必填
   */
  value: FormPlusValue
  /**
   * @desc 选项文案
   */
  label?: string
  /**
   * @desc 是否禁用
   */
  disabled?: boolean
  /**
   * @desc 其它透传给控件的字段(如分组、子节点等)
   */
  [key: string]: unknown
}

/**
 * 单个字段的选项加载状态
 */
export interface FormPlusOptionsState {
  /**
   * @desc 已加载的选项
   */
  options: FormPlusOption[]
  /**
   * @desc 是否加载中
   */
  loading: boolean
  /**
   * @desc 是否已成功加载过
   */
  loaded: boolean
  /**
   * @desc 加载失败信息
   */
  error?: unknown
}

/**
 * 动态数据源,返回选项数组或 Promise
 *
 * 入参为表单联动上下文,因此选项可以依赖其它字段(例如部门变化后加载岗位)。
 */
export type FormPlusOptionsGetter = (
  ctx: FormPlusContext
) => FormPlusOption[] | Promise<FormPlusOption[]>

/**
 * 联动函数,入参为表单联动上下文
 */
export type FormPlusLinkage = (ctx: FormPlusContext) => void | Promise<void>

export interface FormPlusSchemaBase {
  /**
   * @desc 字段名,同时作为 a-form-item 的 name
   */
  field: string
  /**
   * @desc 标签文案
   */
  label?: string
  /**
   * @desc 缺省值,仅在模型中不存在该字段时写入
   */
  defaultValue?: FormPlusValue
  /**
   * @desc 单字段校验规则,与表单级 rules 合并
   */
  rules?: Rule[]
  /**
   * @desc 快捷必填,等价于 rules 中追加 { required: true }
   * @default false
   */
  required?: boolean
  /**
   * @desc 透传给 a-form-item 的额外属性
   */
  formItemProps?: Omit<FormItemProps, 'name' | 'label' | 'rules'>
  /**
   * @desc 栅格占位格数,默认铺满一行
   */
  span?: number
  /**
   * @desc 初始是否显示,动态显隐请用 linkage 中的 hide / show
   * @default true
   */
  visible?: boolean
  /**
   * @desc 静态禁用,动态禁用请用 linkage 中的 setDisabled
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * @desc 标签旁的问号提示文案
   */
  tooltip?: string
  /**
   * @desc 静态选项,与 getOptions 二选一
   */
  options?: FormPlusOption[]
  /**
   * @desc 动态数据源
   */
  getOptions?: FormPlusOptionsGetter
  /**
   * @desc 懒加载选项:首屏不参与批量加载,首次展开下拉或聚焦时才请求
   * @default false
   */
  lazy?: boolean
  /**
   * @desc 选项缓存键,提供时跨实例共享缓存(适合字典类数据)
   */
  cacheKey?: string | ((ctx: FormPlusContext) => string)
  /**
   * @desc 联动依赖字段,仅这些字段变化时才重新执行 linkage
   * @default []
   */
  deps?: string[]
  /**
   * @desc 联动函数,首次挂载与依赖字段变化后执行
   */
  linkage?: FormPlusLinkage
  /**
   * @desc 命中 `#field-<slot>` 具名插槽,完全接管该字段的渲染
   */
  slot?: string
}

/**
 * 表单项配置
 *
 * 联合类型:component 决定 componentProps 的精确类型,
 * 数组需带类型标注(如 `shallowRef<FormPlusProps['schemas']>([...])`)才能享受推断。
 */
export type FormPlusSchema = {
  [K in FormPlusComponentName]: FormPlusSchemaBase & {
    /**
     * @desc 控件名
     */
    component: K
    /**
     * @desc 控件属性
     */
    componentProps?: FormPlusComponentPropsMap[K]
    /**
     * @desc 防呆:内置控件不允许再挂自定义组件
     */
    customComponent?: never
  }
}[FormPlusComponentName]

/**
 * 表单联动上下文
 *
 * 在 schema.linkage 中使用,提供显隐控制、取值设值、schema 配置读写、
 * 选项读写与校验等能力;所有写入都会触发关联联动与 change 事件。
 */
