export type { IconPickerProps, IconSelectorProps } from './src/types'

export const IconPicker = defineAsyncComponent(
  () => import('./src/icon-picker.vue')
)
export const IconSelector = defineAsyncComponent(
  () => import('./src/icon-selector.vue')
)
