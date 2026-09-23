import type { Component } from 'vue'

export interface ErrorBoundaryErrorPayload {
  /**
   * 错误实例
   */
  error: Error
  /**
   * 错误消息
   */
  message: string
  /**
   * 错误栈信息
   */
  stack?: string
  /**
   * 错误信息
   */
  info: string
  /**
   * 发生错误的组件名称
   */
  componentName?: string
  /**
   * 发生错误的时间
   */
  timestamp?: string
}

export interface ErrorBoundaryProps {
  /**
   * @desc 回退组件
   */
  fallback?: Component

  /**
   * @desc 是否允许用户查看组件名、生命周期和错误堆栈
   * @default import.meta.env.DEV
   */
  showDetails?: boolean

  /**
   * @desc 是否阻止错误继续向上传播
   * @default false
   */
  stopPropagation?: boolean

  /**
   * @desc 是否监听网络状态,离线时展示网络断开错误并在网络恢复后自动重置
   * @default true
   */
  monitorNetwork?: boolean
}

export interface ErrorBoundaryEmits {
  /**
   * @desc 错误事件
   * @param payload 错误负载
   */
  error: [payload: ErrorBoundaryErrorPayload]
  /**
   * @desc 重置事件
   */
  reset: []
}

export interface ErrorBoundaryInstance {
  /**
   * @desc 重置错误状态
   */
  resetError: () => void
  /**
   * @desc 是否已捕获到错误
   */
  hasError: boolean
}
