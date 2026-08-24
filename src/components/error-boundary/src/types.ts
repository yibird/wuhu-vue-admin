import type { Component } from 'vue'

export interface ErrorBoundaryErrorPayload {
  /**
   * @description 错误实例
   */
  error: Error
  /**
   * @description 错误消息
   */
  message: string
  /**
   * @description 错误栈信息
   */
  stack?: string
  /**
   * @description 错误信息
   */
  info: string
  /**
   * @description 发生错误的组件名称
   */
  componentName?: string
  /**
   * @description 发生错误的时间
   */
  timestamp?: string
}

export interface ErrorBoundaryProps {
  /**
   * @description 回退组件
   * @default
   */
  fallback?: Component

  /**
   * @description 是否允许用户查看组件名、生命周期和错误堆栈
   * @default import.meta.env.DEV
   */
  showDetails?: boolean

  /**
   * @description 是否阻止错误继续向上传播
   * @default false
   */
  stopPropagation?: boolean
}

export interface ErrorBoundaryEmits {
  /**
   * @description 错误事件
   * @param payload 错误负载
   */
  error: [payload: ErrorBoundaryErrorPayload]
  /**
   * @description 重置事件
   */
  reset: []
}

export interface ErrorBoundaryInstance {
  resetError: () => void
  hasError: boolean
}
