export type {
  CropperCanvasOptions,
  CropperExpose,
  CropperPickerProps,
  CropperProps,
} from './src/types'

export const Cropper = defineAsyncComponent(() => import('./src/Cropper.vue'))
export const CropperPicker = defineAsyncComponent(
  () => import('./src/CropperPicker.vue')
)
