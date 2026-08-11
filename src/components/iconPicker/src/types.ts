export type IconSelectorSize = 'small' | 'middle' | 'large'

export interface IconSelectorOption {
  category?: string
  disabled?: boolean
  keywords?: string[]
  label: string
  value: string
}

export interface IconCategoryItem {
  count: number
  icon: string
  key: string
  label: string
}

export type IconSelectorOptionInput = string | IconSelectorOption

export interface IconSelectorProps {
  allowClear?: boolean
  clearText?: string
  disabled?: boolean
  emptyText?: string
  iconSize?: number
  icons?: IconSelectorOptionInput[]
  gridColumns?: number
  maxVisible?: number
  open?: boolean
  placeholder?: string
  popupMaxHeight?: number
  popupWidth?: number | string
  searchPlaceholder?: string
  showCategories?: boolean
  size?: IconSelectorSize
  title?: string
  triggerLabel?: string
  value?: string
  virtualOverscan?: number
  width?: number | string
}

export interface IconOptionEmits {
  (e: 'update:value', value: string | undefined): void
  (e: 'change', value: string | undefined, option?: IconSelectorOption): void
  (e: 'select', value: string, option: IconSelectorOption): void
  (e: 'clear'): void
  (e: 'search', keyword: string): void
}

export interface IconSelectorEmits extends IconOptionEmits {
  (e: 'update:open', open: boolean): void
}

export type IconPickerProps = IconSelectorProps
export interface IconPickerEmits extends IconOptionEmits {
  (e: 'update:open', open: boolean): void
}
