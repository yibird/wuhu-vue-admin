import type CropperJs from 'cropperjs'
import type { CropperOptions } from 'cropperjs'

export interface CropperProps {
  /**
   * @desc 待裁剪的图片地址
   */
  src: string
  /**
   * @desc 图片的替代文本
   * @default 'image'
   */
  alt?: string
  /**
   * @desc cropperjs 初始化配置
   * @default {}
   */
  options?: CropperOptions
}

export interface CropperEmits {
  /**
   * @desc 裁剪器初始化完成时触发，携带 cropperjs 实例
   */
  ready: [cropper: CropperJs]
}

/**
 * 导出裁剪画布的尺寸选项
 */
export interface CropperCanvasOptions {
  /**
   * 画布宽度
   */
  width?: number
  /**
   * 画布高度
   */
  height?: number
}

export interface CropperInstance {
  /**
   * @desc 旋转图片，角度单位为弧度
   */
  rotate: (angle: number) => void
  /**
   * @desc 缩放图片，可分别指定 x、y 方向比例
   */
  scale: (x: number, y?: number) => void
  /**
   * @desc 按比例缩放图片
   */
  zoom: (factor: number) => void
  /**
   * @desc 重置裁剪器的变换与位置
   */
  reset: () => void
  /**
   * @desc 获取裁剪后的画布
   */
  getCroppedCanvas: (
    options?: CropperCanvasOptions
  ) => Promise<HTMLCanvasElement | null>
  /**
   * @desc 获取 cropperjs 实例
   */
  getInstance: () => CropperJs | null
}

/**
 * 裁剪器组件暴露的实例方法
 */
export type CropperExpose = CropperInstance

export interface CropperPickerProps {
  /**
   * @desc 是否显示裁剪弹窗
   */
  open: boolean
  /**
   * @desc 弹窗标题
   * @default '裁剪图片'
   */
  title?: string
  /**
   * @desc 弹窗宽度
   * @default '600px'
   */
  width?: string | number
  /**
   * @desc 初始图片地址
   * @default ''
   */
  src?: string
  /**
   * @desc cropperjs 初始化配置，会与内置默认模板合并
   */
  options?: CropperOptions
  /**
   * @desc 导出裁剪画布的尺寸选项
   * @default { width: 256, height: 256 }
   */
  canvasOptions?: CropperCanvasOptions
  /**
   * @desc 允许选择的图片最大字节数
   * @default 10 * 1024 * 1024
   */
  maxFileSize?: number
}

export interface CropperPickerEmits {
  /**
   * @desc 弹窗开关状态变化时触发
   */
  'update:open': [value: boolean]
  /**
   * @desc 裁剪完成时触发，携带 JPEG 格式的 data URL
   */
  crop: [dataUrl: string]
}
