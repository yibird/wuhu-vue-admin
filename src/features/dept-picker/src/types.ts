import type { SelectProps } from 'antdv-next'

export interface DeptPickerOption {
  title: string
  value: string
  code?: string
  disabled?: boolean
  children?: DeptPickerOption[]
}

export interface DeptPickerProps {
  options?: DeptPickerOption[]
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  loading?: boolean
  size?: SelectProps['size']
  popupMatchSelectWidth?: SelectProps['popupMatchSelectWidth']
}
