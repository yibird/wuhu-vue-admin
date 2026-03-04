import type {
  FormProps,
  FormItemProps,
  GridProps,
  GridItemProps,
  InputProps,
  InputNumberProps,
  SelectProps,
  CheckboxProps,
  CheckboxGroupProps,
  RadioProps,
  RadioGroupProps,
  SwitchProps,
  DatePickerProps,
  TimePickerProps,
  AutoCompleteProps,
  CascaderProps,
  FormInst
} from 'naive-ui'

export interface FormPlusOptions extends FormProps {
  /**
   * @desc 是否使用Grid布局
   * @default
   */
  grid?: boolean | GridProps
  /**
   * @desc 是否开启表单字段变化,开启后当表单字段值发生变化时,会触发onFormChange事件
   * @default false
   */
  formChange?: boolean
  /**
   * @desc 搜索按钮配置
   * @default
   */
  searchButton?: {
    show?: boolean
    buttons?: Array<'search' | 'reset'>
    gridItemProps?: GridItemProps
  }
}

export type ComponentType =
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'checkbox'
  | 'checkboxGroup'
  | 'radio'
  | 'radioGroup'
  | 'switch'
  | 'datePicker'
  | 'timePicker'
  | 'autoComplete'
  | 'cascader'

// 创建类型映射
export type ComponentPropsMap = {
  input: InputProps
  inputNumber: InputNumberProps
  select: SelectProps
  checkbox: CheckboxProps
  checkboxGroup: CheckboxGroupProps
  radio: RadioProps
  radioGroup: RadioGroupProps
  switch: SwitchProps
  datePicker: DatePickerProps
  timePicker: TimePickerProps
  autoComplete: AutoCompleteProps
  cascader: CascaderProps
}

// 根据 type 动态选择 componentProps 类型
export type ComponentProps<T extends ComponentType> = T extends keyof ComponentPropsMap
  ? ComponentPropsMap[T]
  : never

export interface NFormItemComponent {}

export type FormPlusItem = {
  [K in ComponentType]: FormItemProps & {
    type?: K
    componentProps?: ComponentPropsMap[K]
    /**
     * @desc 布局相关props
     * @default
     */
    span?: GridItemProps['span']
    /**
     * @desc 布局相关props
     * @default
     */
    offset?: GridItemProps['offset']
    /**
     * @desc 是否隐藏
     * @default false
     */
    hidden?: boolean
  }
}[ComponentType]

export interface FormPlusProps {
  options?: FormPlusOptions
  items?: FormPlusItem[]
}

export interface FormPlusFormEmits {
  (e: 'change', values: unknown): void
  (e: 'update:items', items: FormPlusItem[]): void
  (e: 'search', values: any): void
  (e: 'reset'): void
}

export interface FormPlusInstance extends FormInst {
  /**
   * 设置表单字段
   * @param path 字段path
   * @param filed 字段配置
   * @returns void
   */
  setFiled: (path: string, filed: FormPlusItem) => void
  /**
   * 获取表单字段
   * @param path 字段path
   * @returns NFormItem 字段配置
   */
  getFiled: (path: string) => FormPlusItem | undefined
  /**
   * 重置表单字段
   * @param path 字段path
   * @returns void
   */
  resetFiled: (path: string) => void
  /**
   * 获取表单所有字段值
   * @returns 表单所有字段值
   */
  getFiledValues<T = unknown>(): T | undefined
  /**
   * 设置表单所有字段值
   * @param values 表单所有字段值
   * @returns void
   */
  setFiledValues: (values: Record<string, any>) => void
  /**
   * 重置表单所有字段值
   * @returns void
   */
  resetFiledValues: () => void
  /**
   * 设置表单字段值
   * @param path 字段path
   * @param value 字段值
   * @returns void
   */
  setFiledValue: (path: string, value: unknown) => void
  /**
   * 获取表单字段值
   * @param path 字段path
   * @returns 字段值
   */
  getFiledValue: (path: string) => unknown
  /**
   * 重置表单字段值
   * @param path 字段path
   * @returns void
   */
  resetFiledValue: (path: string) => void
}
