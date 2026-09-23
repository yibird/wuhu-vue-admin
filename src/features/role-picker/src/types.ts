import type { SelectProps } from 'antdv-next'

export interface RolePickerOption {
  /**
   * 角色名称
   */
  label: string
  /**
   * 角色值
   */
  value: string
  /**
   * 角色描述
   */
  description?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
}

export interface RolePickerProps {
  /**
   * @desc 角色选项数据
   * @default []
   */
  options?: RolePickerOption[]
  /**
   * @desc 占位提示文本
   * @default "请选择角色"
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
   * @default true
   */
  popupMatchSelectWidth?: SelectProps['popupMatchSelectWidth']
}
