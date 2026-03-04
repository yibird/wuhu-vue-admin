export interface ErrorBoundaryProps {
  /**
   * @desc 是否阻止错误向上传播（默认阻止）
   * @default false
   */
  stopPropagation?: boolean
  /**
   * @desc 错误处理回调
   * @param error 错误对象
   * @param instance 错误发生的组件实例
   * @param info 错误信息
   * @returns void
   */
  onError?: (error: Error, instance: any, info: string) => void
}

export interface ErrorBoundarySlots {
  fallback: () => VNode[]
  default: () => VNode[]
}

export interface ErrorBoundaryInstance {
  /**
   * @desc 是否有错误发生
   */
  hasError: Ref<boolean>
  /**
   * @desc 错误对象
   */
  error: Ref<Error | null>
  /**
   * @desc 重置错误状态
   */
  resetError: () => void
}
