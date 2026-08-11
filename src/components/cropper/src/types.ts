import type CropperJs from 'cropperjs'
import type { CropperOptions } from 'cropperjs'

export interface CropperProps {
  src: string
  alt?: string
  options?: CropperOptions
}

export interface CropperEmits {
  ready: [cropper: CropperJs]
}

export interface CropperCanvasOptions {
  width?: number
  height?: number
}

export interface CropperExpose {
  rotate: (angle: number) => void
  scale: (x: number, y?: number) => void
  zoom: (factor: number) => void
  reset: () => void
  getCroppedCanvas: (
    options?: CropperCanvasOptions
  ) => Promise<HTMLCanvasElement | null>
  getInstance: () => CropperJs | null
}

export interface CropperPickerProps {
  open: boolean
  title?: string
  width?: string | number
  src?: string
  options?: CropperOptions
  canvasOptions?: CropperCanvasOptions
  maxFileSize?: number
}

export interface CropperPickerEmits {
  'update:open': [value: boolean]
  crop: [dataUrl: string]
}
