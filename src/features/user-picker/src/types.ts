import type { SelectProps } from 'antdv-next'

export interface UserPickerOption {
  /**
   * 用户名称
   */
  label: string
  /**
   * 用户值
   */
  value: string
  /**
   * 用户角色
   */
  role?: string
  /**
   * 所属部门
   */
  department?: string
  /**
   * 用户邮箱
   */
  email?: string
  /**
   * 头像自定义 class
   */
  avatarClass?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
}

export interface UserPickerProps {
  /**
   * @desc 用户选项数据
   * @default []
   */
  options?: UserPickerOption[]
  /**
   * @desc 占位提示文本
   * @default "请选择用户"
   */
  placeholder?: string
  /**
   * @desc 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * @desc 是否可清空
   * @default false
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
