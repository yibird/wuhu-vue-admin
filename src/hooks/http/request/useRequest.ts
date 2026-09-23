import {
  getCurrentScope,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
  type Ref,
} from 'vue'
import {
  getCacheEntry,
  isCacheFresh,
  resolveCacheKey,
  setCacheData,
  sharedRequest,
  subscribeCache,
} from './cache.ts'
import { createPoller } from './polling.ts'
import { createRetrier } from './retry.ts'
import { createScheduler } from './scheduler.ts'
import {
  CanceledError,
  NotReadyError,
  isCanceledError,
  isPageHidden,
  noop,
  onPageVisibilityChange,
  onWindowFocus,
  pickWithDefault,
  readNumber,
  readPositiveNumber,
  toArray,
  toError,
} from './utils.ts'
import type {
  GlobalRequestOptions,
  NormalizedRequestOptions,
  Service,
  UseRequestOptions,
  UseRequestReturn,
} from './types.ts'

/**
 * 默认配置,局部配置与全局配置都未提供时生效
 */
const defaults: NormalizedRequestOptions<unknown, unknown[]> = {
  manual: false,
  defaultParams: undefined,
  ready: true,
  refreshDeps: undefined,
  debounceInterval: undefined,
  debounceOptions: { leading: false, trailing: true, maxWait: undefined },
  throttleInterval: undefined,
  throttleOptions: { leading: true, trailing: true },
  pollingInterval: undefined,
  pollingWhenHidden: false,
  pollingWhenOffline: false,
  refreshOnWindowFocus: false,
  refocusTimespan: 5000,
  cacheKey: undefined,
  cacheTime: 10 * 60 * 1000,
  staleTime: 0,
  errorRetryCount: 0,
  errorRetryInterval: undefined,
}

/**
 * 全局配置,仅影响之后创建的实例
 */
let globalOptions: GlobalRequestOptions = {}

/**
 * 设置全局配置,按字段与已有全局配置合并
 * @param options 全局配置
 */
export function setGlobalOptions(options: GlobalRequestOptions): void {
  const { debounceOptions, throttleOptions, ...rest } = options
  globalOptions = { ...globalOptions, ...rest }
  if (debounceOptions) {
    globalOptions.debounceOptions = {
      ...globalOptions.debounceOptions,
      ...debounceOptions,
    }
  }
  if (throttleOptions) {
    globalOptions.throttleOptions = {
      ...globalOptions.throttleOptions,
      ...throttleOptions,
    }
  }
}

/**
 * 读取全局配置快照
 * @returns 全局配置
 */
export function getGlobalOptions(): GlobalRequestOptions {
  const { debounceOptions, throttleOptions, ...rest } = globalOptions
  return {
    ...rest,
    ...(debounceOptions ? { debounceOptions: { ...debounceOptions } } : {}),
    ...(throttleOptions ? { throttleOptions: { ...throttleOptions } } : {}),
  }
}

/**
 * 清空全局配置
 */
export function resetGlobalOptions(): void {
  globalOptions = {}
}

/**
 * 合并局部配置、全局配置与默认配置
 *
 * 顶层字段与嵌套字段均按「局部 > 全局 > 默认」逐字段取值,不整体覆盖。
 *
 * @param local 局部配置
 * @returns 归一化配置
 */
function normalizeOptions<R, P extends unknown[]>(
  local: UseRequestOptions<R, P>
): NormalizedRequestOptions<R, P> {
  const global = globalOptions

  return {
    manual: pickWithDefault(defaults.manual, local.manual, global.manual),
    defaultParams: local.defaultParams,
    ready: pickWithDefault(defaults.ready, local.ready, global.ready),
    refreshDeps: local.refreshDeps,
    debounceInterval: pickWithDefault(
      defaults.debounceInterval,
      local.debounceInterval,
      global.debounceInterval
    ),
    debounceOptions: {
      leading: pickWithDefault(
        defaults.debounceOptions.leading,
        local.debounceOptions?.leading,
        global.debounceOptions?.leading
      ),
      trailing: pickWithDefault(
        defaults.debounceOptions.trailing,
        local.debounceOptions?.trailing,
        global.debounceOptions?.trailing
      ),
      maxWait: pickWithDefault(
        defaults.debounceOptions.maxWait,
        local.debounceOptions?.maxWait,
        global.debounceOptions?.maxWait
      ),
    },
    throttleInterval: pickWithDefault(
      defaults.throttleInterval,
      local.throttleInterval,
      global.throttleInterval
    ),
    throttleOptions: {
      leading: pickWithDefault(
        defaults.throttleOptions.leading,
        local.throttleOptions?.leading,
        global.throttleOptions?.leading
      ),
      trailing: pickWithDefault(
        defaults.throttleOptions.trailing,
        local.throttleOptions?.trailing,
        global.throttleOptions?.trailing
      ),
    },
    pollingInterval: pickWithDefault(
      defaults.pollingInterval,
      local.pollingInterval,
      global.pollingInterval
    ),
    pollingWhenHidden: pickWithDefault(
      defaults.pollingWhenHidden,
      local.pollingWhenHidden,
      global.pollingWhenHidden
    ),
    pollingWhenOffline: pickWithDefault(
      defaults.pollingWhenOffline,
      local.pollingWhenOffline,
      global.pollingWhenOffline
    ),
    refreshOnWindowFocus: pickWithDefault(
      defaults.refreshOnWindowFocus,
      local.refreshOnWindowFocus,
      global.refreshOnWindowFocus
    ),
    refocusTimespan: pickWithDefault(
      defaults.refocusTimespan,
      local.refocusTimespan,
      global.refocusTimespan
    ),
    cacheKey: local.cacheKey,
    cacheTime: pickWithDefault(
      defaults.cacheTime,
      local.cacheTime,
      global.cacheTime
    ),
    staleTime: pickWithDefault(
      defaults.staleTime,
      local.staleTime,
      global.staleTime
    ),
    errorRetryCount: pickWithDefault(
      defaults.errorRetryCount,
      local.errorRetryCount,
      global.errorRetryCount
    ),
    errorRetryInterval: pickWithDefault(
      defaults.errorRetryInterval,
      local.errorRetryInterval,
      global.errorRetryInterval
    ),
    onBefore: local.onBefore,
    onSuccess: local.onSuccess,
    onError: local.onError,
    onAfter: local.onAfter,
  }
}

/**
 * 创建请求管理 Hooks
 *
 * 所有请求入口(run/refresh/依赖变化/轮询/窗口聚焦)最终都会经过同一个内部核心执行函数,
 * 从而保证状态、竞态、缓存与重试只有一份实现。
 *
 * @param service 请求函数
 * @param options 请求配置
 * @returns 请求状态与操作
 */
export function useRequest<R, P extends unknown[]>(
  service: Service<R, P>,
  options: UseRequestOptions<R, P> = {}
): UseRequestReturn<R, P> {
  const normalized = normalizeOptions(options)
  const initialParams = (normalized.defaultParams ?? []) as unknown as P

  const data = shallowRef<R>()
  const loading = shallowRef(false)
  const error = shallowRef<Error>()
  const params = shallowRef<P>(initialParams) as Ref<P>

  let disposed = false
  let executionId = 0
  let hasExecuted = false
  let lastParams: P = initialParams
  const cacheUnsubscribes = new Map<string, () => void>()

  function isReady(): boolean {
    return toValue(normalized.ready) !== false
  }

  function resolveKey(target: P): string | undefined {
    return resolveCacheKey(normalized.cacheKey, target)
  }

  function ensureCacheSubscription(key: string): void {
    if (cacheUnsubscribes.has(key)) return
    const unsubscribe = subscribeCache(key, (cached) => {
      if (disposed) return
      data.value = cached as R
    })
    cacheUnsubscribes.set(key, unsubscribe)
  }

  const retrier = createRetrier({
    getRetryCount: () => readNumber(normalized.errorRetryCount),
    getRetryInterval: () => readNumber(normalized.errorRetryInterval),
  })

  // 静态 cacheKey 在初始化时即订阅缓存,并复用已有缓存数据(便于预加载场景)
  if (typeof normalized.cacheKey === 'string') {
    const staticKey = normalized.cacheKey
    ensureCacheSubscription(staticKey)
    const cached = getCacheEntry<R, P>(staticKey, normalized.cacheTime)
    if (cached) data.value = cached.data
  }

  /**
   * 内部核心执行函数,所有请求最终都从这里进入
   * @param target 本次请求参数
   * @returns 请求结果
   */
  async function executeRequest(target: P): Promise<R> {
    if (disposed) throw new CanceledError('useRequest 已销毁。')
    if (!isReady()) throw new NotReadyError()

    const currentExecutionId = ++executionId
    hasExecuted = true
    lastParams = target
    params.value = target
    loading.value = true
    normalized.onBefore?.(target)

    try {
      const key = resolveKey(target)

      if (key !== undefined) {
        ensureCacheSubscription(key)
        const entry = getCacheEntry<R, P>(key, normalized.cacheTime)

        // 缓存仍然新鲜:直接使用缓存,不发起请求
        if (entry && isCacheFresh(entry, normalized.staleTime)) {
          if (currentExecutionId === executionId) {
            data.value = entry.data
            error.value = undefined
          }
          normalized.onSuccess?.(entry.data, target)
          return entry.data
        }

        // 缓存已过期但仍在存活期内:先展示旧数据(SWR),再后台重新请求
        if (entry && currentExecutionId === executionId) {
          data.value = entry.data
        }
      }

      const result = await sharedRequest<R, P>({
        key,
        params: target,
        execute: () => retrier.run(() => service(...target)),
      })

      if (currentExecutionId === executionId) {
        data.value = result
        error.value = undefined
      }
      normalized.onSuccess?.(result, target)
      return result
    } catch (cause) {
      const requestError = toError(cause)
      // 取消不视为业务失败,不写入 error 也不触发 onError
      if (!isCanceledError(requestError)) {
        if (currentExecutionId === executionId) error.value = requestError
        normalized.onError?.(requestError, target)
      }
      throw requestError
    } finally {
      if (currentExecutionId === executionId) {
        loading.value = false
        schedulePolling()
      }
      normalized.onAfter?.(target)
    }
  }

  /**
   * 轮询回调,使用最近一次参数重新请求
   */
  function pollRequest(): Promise<unknown> {
    return scheduledRun(lastParams).then(noop, noop)
  }

  const poller = createPoller({
    getInterval: () => readPositiveNumber(normalized.pollingInterval),
    pauseOnHidden: !normalized.pollingWhenHidden,
    pauseOnOffline: !normalized.pollingWhenOffline,
    onPoll: pollRequest,
  })

  function schedulePolling(): void {
    if (disposed) return
    if (readPositiveNumber(normalized.pollingInterval) === undefined) return
    poller.start()
  }

  const scheduler = createScheduler<R, P>({
    execute: executeRequest,
    getDebounceInterval: () => readPositiveNumber(normalized.debounceInterval),
    getDebounceOptions: () => normalized.debounceOptions,
    getThrottleInterval: () => readPositiveNumber(normalized.throttleInterval),
    getThrottleOptions: () => normalized.throttleOptions,
  })

  /**
   * 经过调度层的执行入口
   * @param target 本次请求参数
   * @returns 请求结果
   */
  function scheduledRun(target: P): Promise<R> {
    if (disposed) {
      return Promise.reject(new CanceledError('useRequest 已销毁。'))
    }
    if (!isReady()) return Promise.reject(new NotReadyError())
    return scheduler.schedule(target)
  }

  function resolveRefreshParams(): P {
    if (hasExecuted) return lastParams
    return normalized.defaultParams ?? ([] as unknown as P)
  }

  function run(...target: P): void {
    void scheduledRun(target).catch(noop)
  }

  function runAsync(...target: P): Promise<R> {
    return scheduledRun(target)
  }

  function refresh(): void {
    void scheduledRun(resolveRefreshParams()).catch(noop)
  }

  function refreshAsync(): Promise<R> {
    return scheduledRun(resolveRefreshParams())
  }

  function cancel(): void {
    executionId += 1
    loading.value = false
    scheduler.cancel()
    retrier.cancel()
    poller.stop()
  }

  function mutate(updater: R | ((oldData: R | undefined) => R)): R {
    const next =
      typeof updater === 'function'
        ? (updater as (oldData: R | undefined) => R)(data.value)
        : updater
    data.value = next
    const key = resolveKey(lastParams)
    if (key !== undefined) {
      ensureCacheSubscription(key)
      setCacheData(key, next, lastParams)
    }
    return next
  }

  // 轮询间隔动态变化时重新排期或停止
  watch(
    () => readPositiveNumber(normalized.pollingInterval),
    (interval) => {
      if (disposed) return
      if (interval === undefined) {
        poller.stop()
        return
      }
      if (hasExecuted) poller.start()
    }
  )

  // 窗口聚焦 / 页面可见时刷新,通过 refocusTimespan 限制刷新频率
  let lastRefocusAt = 0
  let removeFocusListeners: (() => void) | undefined

  function handleRefocus(): void {
    if (disposed) return
    const timespan = readNumber(normalized.refocusTimespan) ?? 5000
    const now = Date.now()
    if (now - lastRefocusAt < timespan) return
    lastRefocusAt = now
    refresh()
  }

  function setupFocusListeners(): void {
    removeFocusListeners?.()
    removeFocusListeners = undefined
    if (toValue(normalized.refreshOnWindowFocus) !== true) return
    const offFocus = onWindowFocus(handleRefocus)
    const offVisibility = onPageVisibilityChange(() => {
      if (!isPageHidden()) handleRefocus()
    })
    removeFocusListeners = () => {
      offFocus()
      offVisibility()
    }
  }

  watch(
    () => toValue(normalized.refreshOnWindowFocus) === true,
    () => setupFocusListeners()
  )
  setupFocusListeners()

  // 依赖变化重新请求(manual 模式下同样生效,但依然经过 ready 与调度层)
  const refreshDeps = toArray(normalized.refreshDeps)
  if (refreshDeps.length > 0) {
    watch(refreshDeps, () => {
      if (disposed) return
      void scheduledRun(resolveRefreshParams()).catch(noop)
    })
  }

  // 初始化自动请求:ready 为 false 时等待其变为 true
  if (!normalized.manual) {
    if (isReady()) {
      run(...initialParams)
    } else {
      watch(
        () => isReady(),
        (ready) => {
          if (!ready || disposed) return
          run(...initialParams)
        }
      )
    }
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      disposed = true
      executionId += 1
      loading.value = false
      scheduler.cancel()
      retrier.cancel()
      poller.dispose()
      removeFocusListeners?.()
      removeFocusListeners = undefined
      for (const unsubscribe of cacheUnsubscribes.values()) unsubscribe()
      cacheUnsubscribes.clear()
    })
  }

  return {
    data,
    loading,
    error,
    params,
    run,
    runAsync,
    cancel,
    refresh,
    refreshAsync,
    mutate,
  }
}

export interface PrefetchOptions<P extends unknown[]> {
  /**
   * @desc 缓存 key,与 useRequest 的 cacheKey 规则一致
   */
  cacheKey: string | ((params: P) => string)
}

/**
 * 预加载请求数据
 *
 * 复用与 useRequest 完全相同的全局缓存与进行中请求,不额外维护另一套缓存。
 *
 * @param service 请求函数
 * @param params 请求参数
 * @param options 预加载配置
 * @returns 请求结果
 */
export function prefetch<R, P extends unknown[]>(
  service: Service<R, P>,
  params: P,
  options: PrefetchOptions<P>
): Promise<R> {
  return sharedRequest<R, P>({
    key: resolveCacheKey(options.cacheKey, params),
    params,
    execute: () => service(...params),
  })
}
