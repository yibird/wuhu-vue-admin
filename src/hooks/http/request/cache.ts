/**
 * 缓存条目
 */
export interface CacheEntry<R, P extends unknown[]> {
  /**
   * @desc 缓存数据
   */
  data: R
  /**
   * @desc 产生该数据的请求参数
   */
  params: P
  /**
   * @desc 写入时间戳
   */
  time: number
}

type CacheListener = (data: unknown, params: unknown[]) => void

/**
 * 全局缓存,所有 useRequest 实例共享
 */
const cacheStore = new Map<string, CacheEntry<unknown, unknown[]>>()

/**
 * 进行中的请求,用于相同 cacheKey 的 Promise 共享
 */
const pendingStore = new Map<string, Promise<unknown>>()

/**
 * 缓存订阅者,用于多个实例之间的数据同步
 */
const listenerStore = new Map<string, Set<CacheListener>>()

/**
 * 解析缓存 key
 * @param cacheKey 字符串或按参数计算的 key 函数
 * @param params 请求参数
 * @returns 缓存 key
 */
export function resolveCacheKey<P extends unknown[]>(
  cacheKey: string | ((params: P) => string) | undefined,
  params: P
): string | undefined {
  if (typeof cacheKey === 'string') return cacheKey
  if (typeof cacheKey === 'function') return cacheKey(params)
  return undefined
}

/**
 * 判断缓存是否超出存活时间
 * @param entry 缓存条目
 * @param cacheTime 存活时间,小于 0 表示永不过期
 * @param now 当前时间戳
 * @returns 是否过期
 */
export function isCacheExpired(
  entry: CacheEntry<unknown, unknown[]>,
  cacheTime: number,
  now = Date.now()
): boolean {
  if (cacheTime < 0) return false
  return now - entry.time > cacheTime
}

/**
 * 判断缓存是否仍然新鲜
 * @param entry 缓存条目
 * @param staleTime 新鲜时间,-1 表示永不过期
 * @param now 当前时间戳
 * @returns 是否新鲜
 */
export function isCacheFresh(
  entry: CacheEntry<unknown, unknown[]>,
  staleTime: number,
  now = Date.now()
): boolean {
  if (staleTime < 0) return true
  return now - entry.time <= staleTime
}

/**
 * 读取未过期的缓存条目,过期时顺带清理
 * @param key 缓存 key
 * @param cacheTime 存活时间
 * @returns 缓存条目
 */
export function getCacheEntry<R, P extends unknown[]>(
  key: string,
  cacheTime: number
): CacheEntry<R, P> | undefined {
  const entry = cacheStore.get(key)
  if (!entry) return undefined
  if (isCacheExpired(entry, cacheTime)) {
    cacheStore.delete(key)
    return undefined
  }
  return entry as CacheEntry<R, P>
}

/**
 * 写入缓存并通知订阅者
 * @param key 缓存 key
 * @param data 缓存数据
 * @param params 请求参数
 */
export function setCacheData<R, P extends unknown[]>(
  key: string,
  data: R,
  params: P
): void {
  cacheStore.set(key, {
    data,
    params,
    time: Date.now(),
  })
  const listeners = listenerStore.get(key)
  if (!listeners?.size) return
  // 复制一份再遍历,避免通知过程中订阅关系变化影响本次分发
  for (const listener of Array.from(listeners)) {
    listener(data, params)
  }
}

/**
 * 读取进行中的请求
 * @param key 缓存 key
 * @returns 进行中的请求 Promise
 */
export function getPendingRequest<R>(key: string): Promise<R> | undefined {
  return pendingStore.get(key) as Promise<R> | undefined
}

/**
 * 记录/清除进行中的请求
 * @param key 缓存 key
 * @param promise 请求 Promise,undefined 表示清除
 */
export function setPendingRequest(
  key: string,
  promise: Promise<unknown> | undefined
): void {
  if (promise) pendingStore.set(key, promise)
  else pendingStore.delete(key)
}

/**
 * 订阅某个 cacheKey 的数据变化
 * @param key 缓存 key
 * @param listener 数据变化回调
 * @returns 取消订阅函数
 */
export function subscribeCache(
  key: string,
  listener: CacheListener
): () => void {
  const listeners = listenerStore.get(key) ?? new Set<CacheListener>()
  listeners.add(listener)
  listenerStore.set(key, listeners)
  return () => {
    const current = listenerStore.get(key)
    if (!current) return
    current.delete(listener)
    if (current.size === 0) listenerStore.delete(key)
  }
}

/**
 * 清空请求缓存
 * @param key 指定 key 时只清理该 key
 */
export function clearRequestCache(key?: string): void {
  if (key !== undefined) {
    cacheStore.delete(key)
    pendingStore.delete(key)
    return
  }
  cacheStore.clear()
  pendingStore.clear()
}

export interface SharedRequestOptions<R, P extends unknown[]> {
  /**
   * @desc 缓存 key,未配置时不参与缓存与请求共享
   */
  key: string | undefined
  /**
   * @desc 请求参数
   */
  params: P
  /**
   * @desc 真正的请求执行函数
   */
  execute: () => Promise<R>
}

/**
 * 执行请求并处理缓存与 Promise 共享
 *
 * 相同 cacheKey 同时只会有一个真实请求,后续调用复用进行中的 Promise;
 * 请求成功后写入缓存,失败时不写缓存。
 *
 * @param options 请求选项
 * @returns 请求结果 Promise
 */
export async function sharedRequest<R, P extends unknown[]>(
  options: SharedRequestOptions<R, P>
): Promise<R> {
  const { key, params, execute } = options
  if (key === undefined) return execute()

  const pending = getPendingRequest<R>(key)
  if (pending) return pending

  const promise = execute()
  setPendingRequest(key, promise)
  promise.then(
    (result) => {
      setPendingRequest(key, undefined)
      setCacheData(key, result, params)
    },
    () => {
      setPendingRequest(key, undefined)
    }
  )
  return promise
}
