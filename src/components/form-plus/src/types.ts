import type { ToRefs } from 'vue'

export type FormPlusValue = unknown
export type FormPlusModel = Record<string, FormPlusValue>
export type FormPlusSlots = Record<string, unknown>

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

export interface FormPlusControlProps extends Record<string, unknown> {
  /**
   * 栅格占位格数
   */
  span?: number
  /**
   * 是否可清空
   */
  clearable?: boolean
}

export interface FormPlusItem {
  /**
   * 控件类型
   */
  type: ComponentType
  /**
   * 字段名
   */
  field: string
  /**
   * 标签文本
   */
  label: string
  /**
   * 控件属性
   */
  props?: FormPlusControlProps
  /**
   * 控件插槽
   */
  slots?: FormPlusSlots
}

export interface FormPlusProps {
  /**
   * @desc 表单配置
   */
  options: {
    /**
     * @desc 表单项列表
     */
    items: readonly FormPlusItem[]
    /**
     * @desc 标签位置
     */
    labelPlacement?: 'left' | 'top'
    /**
     * @desc 标签宽度,auto 表示自适应
     */
    labelWidth?: number | 'auto'
    /**
     * @desc 栅格布局配置,配置后按栅格布局渲染
     */
    grid?: {
      /**
       * @desc 水平间距
       */
      xGap?: number
      /**
       * @desc 垂直间距
       */
      yGap?: number
    }
  }
}

export interface FormContextState extends FormPlusProps {}

export type FormPlusProvide = ToRefs<Required<FormContextState>> & {
  /**
   * @desc 表单事件
   */
  emits: {
    /**
     * @desc 提交表单时触发
     */
    (e: 'submit', values: FormPlusModel): void
    /**
     * @desc 重置表单时触发
     */
    (e: 'reset'): void
  }
}

export interface FormPlusContext {}

export interface FormPlusInstance {
  /**
   * @desc 提交表单
   */
  submit: () => void
  /**
   * @desc 重置表单
   */
  reset: () => void
  /**
   * @desc 设置单个字段值
   */
  setFieldValue: (field: string, value: FormPlusValue) => void
  /**
   * @desc 获取单个字段值
   */
  getFieldValue: (field: string) => FormPlusValue
  /**
   * @desc 批量设置字段值
   */
  setFieldsValue: (values: FormPlusModel) => void
  /**
   * @desc 获取全部字段值
   */
  getFieldsValue: () => FormPlusModel
}
