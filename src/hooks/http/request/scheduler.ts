import type { DebounceOptions, ThrottleOptions } from './types.ts'
import {
  CanceledError,
  clearTimer,
  createDeferred,
  type Deferred,
  type TimerId,
} from './utils.ts'

export interface SchedulerOptions<R, P extends unknown[]> {
  /**
   * @desc 真实请求执行函数
   */
  execute: (params: P) => Promise<R>
  /**
   * @desc 读取防抖间隔
   */
  getDebounceInterval: () => number | undefined
  /**
   * @desc 读取防抖配置
   */
  getDebounceOptions: () => Required<Omit<DebounceOptions, 'maxWait'>> & {
    maxWait: number | undefined
  }
  /**
   * @desc 读取节流间隔
   */
  getThrottleInterval: () => number | undefined
  /**
   * @desc 读取节流配置
   */
  getThrottleOptions: () => Required<ThrottleOptions>
}

export interface Scheduler<R, P extends unknown[]> {
  /**
   * @desc 进入调度,返回该次调用的结果 Promise
   */
  schedule: (params: P) => Promise<R>
  /**
   * @desc 取消尚未执行的调度,并丢弃调度中的调用
   */
  cancel: () => void
}

interface Runner<R, P extends unknown[]> {
  schedule: (params: P) => Promise<R>
  cancel: () => void
}

/**
 * 把批次执行结果转交给等待者
 * @param waiter 等待者
 * @param promise 执行结果
 */
function bind<R>(waiter: Deferred<R>, promise: Promise<R>): void {
  promise.then(waiter.resolve, waiter.reject)
}

/**
 * 创建防抖执行器
 *
 * 语义:
 * - 默认 leading:false / trailing:true:连续触发合并为一次执行,使用最后一次参数;
 * - leading:true 时窗口内首次调用立即执行,窗口内后续调用若开启 trailing 则在静默后补一次执行;
 * - 未开启 trailing 时,窗口内的后续调用共享最近一次执行的结果(保证每个调用都能 settle);
 * - maxWait 到期强制执行一次,避免持续触发导致长时间不执行。
 *
 * @param options 调度配置
 * @returns 防抖执行器
 */
function createDebounceRunner<R, P extends unknown[]>(
  options: SchedulerOptions<R, P>
): Runner<R, P> {
  let timer: TimerId | undefined
  let inWindow = false
  let batchStart = 0
  let pendingParams: P | undefined
  let waiters: Array<Deferred<R>> = []
  let leadingPromise: Promise<R> | undefined

  function reset(): void {
    clearTimer(timer)
    timer = undefined
    inWindow = false
    pendingParams = undefined
    waiters = []
    leadingPromise = undefined
  }

  function flush(): void {
    clearTimer(timer)
    timer = undefined
    const target = pendingParams
    const batch = waiters
    waiters = []
    pendingParams = undefined
    inWindow = false
    leadingPromise = undefined
    if (target === undefined || batch.length === 0) return
    const promise = options.execute(target)
    for (const waiter of batch) bind(waiter, promise)
  }

  function armTimer(now: number): void {
    const interval = options.getDebounceInterval()
    if (interval === undefined || interval <= 0) {
      flush()
      return
    }
    const { maxWait } = options.getDebounceOptions()
    let delay = interval
    if (maxWait !== undefined && maxWait > 0) {
      const elapsed = now - batchStart
      if (elapsed >= maxWait) {
        flush()
        return
      }
      delay = Math.min(delay, maxWait - elapsed)
    }
    clearTimer(timer)
    timer = setTimeout(flush, delay)
  }

  function schedule(params: P): Promise<R> {
    const interval = options.getDebounceInterval()
    if (interval === undefined || interval <= 0) return options.execute(params)

    const waiter = createDeferred<R>()
    const now = Date.now()
    const { leading, trailing } = options.getDebounceOptions()

    if (!inWindow) {
      inWindow = true
      batchStart = now
      if (leading) {
        const promise = options.execute(params)
        leadingPromise = promise
        bind(waiter, promise)
      } else {
        pendingParams = params
        waiters.push(waiter)
      }
    } else if (trailing) {
      pendingParams = params
      waiters.push(waiter)
    } else if (leadingPromise) {
      // 未开启 trailing:窗口内的调用合并到窗口开始时的执行结果
      bind(waiter, leadingPromise)
      return waiter.promise
    } else {
      pendingParams = params
      waiters.push(waiter)
    }

    armTimer(now)
    return waiter.promise
  }

  function cancel(): void {
    const batch = waiters
    reset()
    for (const waiter of batch) waiter.reject(new CanceledError())
  }

  return { schedule, cancel }
}

/**
 * 创建节流执行器
 *
 * 语义:
 * - 默认 leading:true / trailing:true:窗口开始立即执行,窗口内调用合并到窗口结束时补一次;
 * - leading:false 时首次执行推迟到窗口结束;
 * - 未开启 trailing 时,窗口内的调用共享窗口开始时的执行结果。
 *
 * @param options 调度配置
 * @returns 节流执行器
 */
function createThrottleRunner<R, P extends unknown[]>(
  options: SchedulerOptions<R, P>
): Runner<R, P> {
  let timer: TimerId | undefined
  let lastInvokeAt = 0
  let pendingParams: P | undefined
  let waiters: Array<Deferred<R>> = []
  let lastPromise: Promise<R> | undefined

  function clear(): void {
    clearTimer(timer)
    timer = undefined
  }

  function invoke(params: P, batch: Array<Deferred<R>>): void {
    lastInvokeAt = Date.now()
    const promise = options.execute(params)
    lastPromise = promise
    for (const waiter of batch) bind(waiter, promise)
  }

  function flushTrailing(): void {
    clear()
    const target = pendingParams
    const batch = waiters
    waiters = []
    pendingParams = undefined
    if (target === undefined || batch.length === 0) return
    invoke(target, batch)
  }

  function armTrailing(delay: number): void {
    clear()
    timer = setTimeout(flushTrailing, delay)
  }

  function schedule(params: P): Promise<R> {
    const interval = options.getThrottleInterval()
    if (interval === undefined || interval <= 0) return options.execute(params)

    const waiter = createDeferred<R>()
    const { leading, trailing } = options.getThrottleOptions()
    const remaining = interval - (Date.now() - lastInvokeAt)

    if (remaining <= 0) {
      clear()
      if (leading) {
        invoke(params, [waiter])
      } else {
        pendingParams = params
        waiters.push(waiter)
        armTrailing(interval)
      }
      return waiter.promise
    }

    if (trailing) {
      pendingParams = params
      waiters.push(waiter)
      if (timer === undefined) armTrailing(remaining)
      return waiter.promise
    }

    if (lastPromise) {
      bind(waiter, lastPromise)
      return waiter.promise
    }

    // leading:false 且未开启 trailing 时,退化为窗口结束时执行一次
    pendingParams = params
    waiters.push(waiter)
    if (timer === undefined) armTrailing(remaining)
    return waiter.promise
  }

  function cancel(): void {
    clear()
    const batch = waiters
    waiters = []
    pendingParams = undefined
    lastPromise = undefined
    lastInvokeAt = 0
    for (const waiter of batch) waiter.reject(new CanceledError())
  }

  return { schedule, cancel }
}

/**
 * 创建请求调度器
 *
 * 同时配置防抖与节流时以防抖为准。
 *
 * @param options 调度配置
 * @returns 调度器
 */
export function createScheduler<R, P extends unknown[]>(
  options: SchedulerOptions<R, P>
): Scheduler<R, P> {
  const debounceRunner = createDebounceRunner(options)
  const throttleRunner = createThrottleRunner(options)

  function schedule(params: P): Promise<R> {
    const debounceInterval = options.getDebounceInterval()
    if (debounceInterval !== undefined && debounceInterval > 0) {
      return debounceRunner.schedule(params)
    }
    return throttleRunner.schedule(params)
  }

  function cancel(): void {
    debounceRunner.cancel()
    throttleRunner.cancel()
  }

  return { schedule, cancel }
}
