import type { SelectProps } from 'antdv-next'

export interface RolePickerOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export interface RolePickerProps {
  options?: RolePickerOption[]
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  loading?: boolean
  size?: SelectProps['size']
  popupMatchSelectWidth?: SelectProps['popupMatchSelectWidth']
}
