import type { App } from 'vue'
import { isCanceledError } from '@/errors'

interface GlobalErrorContext {
  /**
   * @desc 错误来源
   */
  source: 'vue' | 'unhandledrejection'
  /**
   * @desc Vue 错误发生阶段,例如 render / setup / watcher
   */
  info?: string
  /**
   * @desc 发生错误的组件名,Vue 无法定位时为空
   */
  component?: string
}

/**
 * 判断是否为主动取消产生的错误
 *
 * 组件卸载、路由切换和请求取消都会中断异步任务,这类异常属于正常流程,
 * 记录到控制台或上报平台只会产生噪音。
 */
function isIgnorableError(error: unknown) {
  return (
    isCanceledError(error) ||
    (error instanceof Error && error.name === 'AbortError')
  )
}

/**
 * 记录全局错误
 *
 * 请求层已经统一提示接口错误,这里只做兜底记录,避免重复打扰用户。
 * 后续接入错误上报平台时,在这里补充上报逻辑即可。
 */
function reportGlobalError(error: unknown, context: GlobalErrorContext) {
  if (isIgnorableError(error)) return

  const tag = [context.source, context.info, context.component]
    .filter(Boolean)
    .join(':')
  console.error(`[global-error] ${tag}`, error)
}

/**
 * 安装全局错误处理
 *
 * `app.config.errorHandler` 捕获渲染、生命周期、watch、事件处理器等
 * Vue 内部异常;`unhandledrejection` 补充捕获未被业务代码处理的 Promise 拒绝。
 */
export function setupGlobalErrorHandler(app: App) {
  app.config.errorHandler = (error, instance, info) => {
    reportGlobalError(error, {
      source: 'vue',
      info,
      component: instance?.$options.name,
    })
  }

  window.addEventListener('unhandledrejection', (event) => {
    reportGlobalError(event.reason, { source: 'unhandledrejection' })
  })
}
