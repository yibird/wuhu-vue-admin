import type { SelectProps } from 'antdv-next'

export interface DeptPickerOption {
  /**
   * 部门名称
   */
  title: string
  /**
   * 部门值
   */
  value: string
  /**
   * 部门编码
   */
  code?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 子部门
   */
  children?: DeptPickerOption[]
}

export interface DeptPickerProps {
  /**
   * @desc 部门选项数据
   * @default []
   */
  options?: DeptPickerOption[]
  /**
   * @desc 占位提示文本
   * @default "请选择部门"
   */
  placeholder?: string
  /**
   * @desc 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * @desc 是否可清空
   * @default true
   */
  allowClear?: boolean
  /**
   * @desc 是否加载中
   * @default false
   */
  loading?: boolean
  /**
   * @desc 选择器尺寸
   */
  size?: SelectProps['size']
  /**
   * @desc 下拉框是否与选择器同宽
   * @default 320
   */
  popupMatchSelectWidth?: SelectProps['popupMatchSelectWidth']
}
