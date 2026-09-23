import { toValue, type MaybeRefOrGetter } from 'vue'

// 请求相关错误统一定义在 @/errors,这里透出以保持 hooks 模块的导入路径不变
export {
  CanceledError,
  isCanceledError,
  NotReadyError,
} from '../../../errors/index.ts'

/**
 * 将任意异常转换为 Error 实例
 * @param value 原始异常
 * @returns Error 实例
 */
export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export interface Deferred<T> {
  /**
   * @desc 受控 Promise
   */
  promise: Promise<T>
  /**
   * @desc 成功回调
   */
  resolve: (value: T) => void
  /**
   * @desc 失败回调
   */
  reject: (error: unknown) => void
}

/**
 * 创建一个可由外部控制 settle 时机的 Promise
 * @returns 受控 Promise 及其 resolve/reject
 */
export function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((resolveFn, rejectFn) => {
    resolve = resolveFn
    reject = rejectFn
  })
  return { promise, resolve, reject }
}

/**
 * 空函数
 */
export function noop(): void {}

export type TimerId = ReturnType<typeof setTimeout>

/**
 * 清理定时器
 * @param timer 定时器 id
 */
export function clearTimer(timer: TimerId | undefined): void {
  if (timer !== undefined) clearTimeout(timer)
}

/**
 * 读取数字型配置,非法值统一返回 undefined
 * @param value 数字或响应式数字配置
 * @returns 有效数字或 undefined
 */
export function readNumber(
  value: MaybeRefOrGetter<number | undefined> | undefined
): number | undefined {
  if (value === undefined) return undefined
  const resolved = toValue(value)
  return typeof resolved === 'number' && Number.isFinite(resolved)
    ? resolved
    : undefined
}

/**
 * 读取正数型配置,<=0 视为未开启
 * @param value 数字或响应式数字配置
 * @returns 正数或 undefined
 */
export function readPositiveNumber(
  value: MaybeRefOrGetter<number | undefined> | undefined
): number | undefined {
  const resolved = readNumber(value)
  return resolved !== undefined && resolved > 0 ? resolved : undefined
}

/**
 * 取第一个已定义的值,用于多级配置合并
 * @param defaultValue 兜底值
 * @param values 候选值(优先级从高到低)
 * @returns 最终取值
 */
export function pickWithDefault<T>(
  defaultValue: T,
  ...values: Array<T | undefined>
): T {
  for (const value of values) {
    if (value !== undefined) return value
  }
  return defaultValue
}

/**
 * 将 WatchSource 配置统一为数组
 * @param deps 依赖配置
 * @returns 依赖数组
 */
export function toArray<T>(deps: T | T[] | undefined): T[] {
  if (deps === undefined) return []
  return Array.isArray(deps) ? deps : [deps]
}

/**
 * 页面是否处于隐藏状态(非浏览器环境视为可见)
 * @returns 是否隐藏
 */
export function isPageHidden(): boolean {
  return typeof document !== 'undefined' && document.hidden === true
}

/**
 * 浏览器是否处于离线状态(非浏览器环境视为在线)
 * @returns 是否离线
 */
export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

/**
 * 监听页面可见性变化
 * @param listener 变化回调
 * @returns 取消监听函数
 */
export function onPageVisibilityChange(listener: () => void): () => void {
  if (typeof document === 'undefined') return noop
  document.addEventListener('visibilitychange', listener)
  return () => document.removeEventListener('visibilitychange', listener)
}

/**
 * 监听浏览器联网状态变化
 * @param listener 变化回调
 * @returns 取消监听函数
 */
export function onNetworkStatusChange(listener: () => void): () => void {
  if (typeof window === 'undefined') return noop
  window.addEventListener('online', listener)
  window.addEventListener('offline', listener)
  return () => {
    window.removeEventListener('online', listener)
    window.removeEventListener('offline', listener)
  }
}

/**
 * 监听窗口聚焦
 * @param listener 聚焦回调
 * @returns 取消监听函数
 */
export function onWindowFocus(listener: () => void): () => void {
  if (typeof window === 'undefined') return noop
  window.addEventListener('focus', listener)
  return () => window.removeEventListener('focus', listener)
}
