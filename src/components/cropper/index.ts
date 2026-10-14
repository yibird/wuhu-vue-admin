export type {
  CropperCanvasOptions,
  CropperExpose,
  CropperPickerProps,
  CropperProps,
} from './src/types'

export const Cropper = defineAsyncComponent(() => import('./src/cropper.vue'))
export const CropperPicker = defineAsyncComponent(
  () => import('./src/cropper-picker.vue')
)
