import type { ErrorBoundaryErrorPayload } from '../../error-boundary'
import type { VNode } from 'vue'

export interface ExceptionProps {
  /**
   * @desc 插图地址
   */
  image?: string
  /**
   * @desc 插图替代文本
   * @default ''
   */
  imageAlt?: string
  /**
   * @desc 标题
   * @default ''
   */
  title?: string
  /**
   * @desc 描述
   * @default ''
   */
  description?: string
  /**
   * @desc 按钮文案
   * @default '返回首页'
   */
  buttonText?: string
  /**
   * @desc 是否显示按钮
   * @default true
   */
  showBtn?: boolean
}

export interface ExceptionSlots {
  /**
   * @desc 自定义标题
   */
  title?: () => VNode[]
  /**
   * @desc 自定义描述
   */
  description?: () => VNode[]
}

export interface ClientErrorProps {
  readonly error: ErrorBoundaryErrorPayload | null
  readonly showDetails?: boolean
}
