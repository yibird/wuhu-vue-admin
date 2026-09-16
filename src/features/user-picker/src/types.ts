import type { SelectProps } from 'antdv-next'

export interface UserPickerOption {
  label: string
  value: string
  role?: string
  department?: string
  email?: string
  avatarClass?: string
  disabled?: boolean
}

export interface UserPickerProps {
  options?: UserPickerOption[]
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  loading?: boolean
  size?: SelectProps['size']
  popupMatchSelectWidth?: SelectProps['popupMatchSelectWidth']
}
