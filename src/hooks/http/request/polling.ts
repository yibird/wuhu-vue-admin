import {
  clearTimer,
  isBrowserOffline,
  isPageHidden,
  onNetworkStatusChange,
  onPageVisibilityChange,
  type TimerId,
} from './utils.ts'

export interface PollerOptions {
  /**
   * @desc 读取轮询间隔,返回 undefined 或 <=0 视为关闭轮询
   */
  getInterval: () => number | undefined
  /**
   * @desc 单次轮询执行函数
   */
  onPoll: () => Promise<unknown>
  /**
   * @desc 页面隐藏时是否暂停
   */
  pauseOnHidden: boolean
  /**
   * @desc 浏览器离线时是否暂停
   */
  pauseOnOffline: boolean
}

export interface Poller {
  /**
   * @desc 开启轮询(已开启时按最新间隔重新排期)
   */
  start: () => void
  /**
   * @desc 按当前间隔重新排期
   */
  schedule: () => void
  /**
   * @desc 停止轮询
   */
  stop: () => void
  /**
   * @desc 销毁轮询并移除所有监听
   */
  dispose: () => void
}

/**
 * 创建轮询器
 *
 * 采用「请求完成 → 等待 interval → 下一次请求」的模型,不使用 setInterval,
 * 避免上一次请求尚未结束时重复触发。
 *
 * @param options 轮询配置
 * @returns 轮询器
 */
export function createPoller(options: PollerOptions): Poller {
  let timer: TimerId | undefined
  let active = false
  let disposed = false
  const disposers: Array<() => void> = []

  function shouldPause(): boolean {
    if (options.pauseOnHidden && isPageHidden()) return true
    if (options.pauseOnOffline && isBrowserOffline()) return true
    return false
  }

  function clear(): void {
    clearTimer(timer)
    timer = undefined
  }

  async function poll(): Promise<void> {
    try {
      await options.onPoll()
    } catch {
      // 单次轮询失败不终止轮询,继续下一次调度
    }
    schedule()
  }

  function schedule(): void {
    clear()
    if (disposed || !active) return
    const interval = options.getInterval()
    if (interval === undefined || interval <= 0) return
    if (shouldPause()) return
    timer = setTimeout(() => {
      timer = undefined
      poll()
    }, interval)
  }

  /**
   * 监听只在轮询实际运行时注册
   *
   * 未配置轮询间隔的请求实例不需要任何全局监听,
   * 集中到 start/stop 可避免按请求实例数量堆积 visibilitychange/online/offline 监听。
   */
  function attachListeners(): void {
    if (disposers.length > 0) return
    if (options.pauseOnHidden) {
      disposers.push(
        onPageVisibilityChange(() => {
          if (!isPageHidden()) schedule()
        })
      )
    }
    if (options.pauseOnOffline) {
      disposers.push(
        onNetworkStatusChange(() => {
          if (!isBrowserOffline()) schedule()
        })
      )
    }
  }

  function detachListeners(): void {
    for (const off of disposers) off()
    disposers.length = 0
  }

  function start(): void {
    if (disposed) return
    active = true
    attachListeners()
    schedule()
  }

  function stop(): void {
    active = false
    clear()
    detachListeners()
  }

  function dispose(): void {
    disposed = true
    active = false
    clear()
    detachListeners()
  }

  return { start, schedule, stop, dispose }
}
