import {
  CanceledError,
  clearTimer,
  isCanceledError,
  type TimerId,
} from './utils.ts'

/**
 * 指数退避基础间隔(毫秒)
 */
export const RETRY_BASE_INTERVAL = 1000

/**
 * 指数退避最大间隔(毫秒)
 */
export const RETRY_MAX_INTERVAL = 30_000

export interface RetrierOptions {
  /**
   * @desc 读取重试次数
   */
  getRetryCount: () => number | undefined
  /**
   * @desc 读取固定重试间隔,未配置时使用指数退避
   */
  getRetryInterval: () => number | undefined
}

export interface Retrier {
  /**
   * @desc 执行任务,失败时按配置重试
   */
  run: <T>(task: () => Promise<T>) => Promise<T>
  /**
   * @desc 取消后续重试
   */
  cancel: () => void
}

/**
 * 计算第 attempt 次重试前的等待时间
 *
 * 未配置固定间隔时使用指数退避:1s → 2s → 4s ... 上限 30s。
 *
 * @param attempt 重试次序,从 1 开始
 * @param interval 固定间隔
 * @returns 等待毫秒数
 */
export function getRetryDelay(
  attempt: number,
  interval: number | undefined
): number {
  if (interval !== undefined && interval >= 0) return interval
  return Math.min(RETRY_MAX_INTERVAL, RETRY_BASE_INTERVAL * 2 ** (attempt - 1))
}

/**
 * 创建重试器
 *
 * 重试只包裹最底层的请求执行,不会重新进入 debounce/throttle/polling 调度。
 *
 * @param options 重试配置读取器
 * @returns 重试器
 */
export function createRetrier(options: RetrierOptions): Retrier {
  let generation = 0
  let timer: TimerId | undefined
  const pendingRejects = new Set<(error: unknown) => void>()

  function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const rejectOnCancel = (error: unknown) => reject(error)
      pendingRejects.add(rejectOnCancel)
      clearTimer(timer)
      timer = setTimeout(() => {
        pendingRejects.delete(rejectOnCancel)
        timer = undefined
        resolve()
      }, ms)
    })
  }

  async function run<T>(task: () => Promise<T>): Promise<T> {
    const retryCount = Math.max(0, Math.floor(options.getRetryCount() ?? 0))
    const currentGeneration = generation
    let attempt = 0

    for (;;) {
      try {
        return await task()
      } catch (cause) {
        if (isCanceledError(cause)) throw cause
        if (currentGeneration !== generation || attempt >= retryCount) {
          throw cause
        }
        attempt += 1
        await wait(getRetryDelay(attempt, options.getRetryInterval()))
      }
    }
  }

  function cancel(): void {
    generation += 1
    clearTimer(timer)
    timer = undefined
    for (const reject of pendingRejects) reject(new CanceledError())
    pendingRejects.clear()
  }

  return { run, cancel }
}
