import type { MaybeRefOrGetter, Ref, ShallowRef, WatchSource } from 'vue'

/**
 * 请求服务函数,接收业务参数并返回 Promise
 */
export type Service<R, P extends unknown[]> = (...params: P) => Promise<R>

/**
 * 防抖配置
 */
export interface DebounceOptions {
  /**
   * @desc 是否在延迟开始前立即执行一次
   * @default false
   */
  leading?: boolean
  /**
   * @desc 是否在延迟结束后执行一次
   * @default true
   */
  trailing?: boolean
  /**
   * @desc 最大等待时间,超过后强制执行一次,避免长时间的连续触发导致一直不执行
   * @default undefined
   */
  maxWait?: number
}

/**
 * 节流配置
 */
export interface ThrottleOptions {
  /**
   * @desc 是否在时间窗口开始时立即执行
   * @default true
   */
  leading?: boolean
  /**
   * @desc 是否在时间窗口结束时补一次执行
   * @default true
   */
  trailing?: boolean
}

/**
 * 请求生命周期回调
 */
export interface RequestCallbacks<R, P extends unknown[]> {
  /**
   * @desc 请求开始前触发(缓存命中时同样触发)
   * @param params 本次请求参数
   */
  onBefore?: (params: P) => void
  /**
   * @desc 请求成功(或命中 fresh 缓存)时触发
   * @param data 本次数据
   * @param params 本次请求参数
   */
  onSuccess?: (data: R, params: P) => void
  /**
   * @desc 请求失败时触发
   * @param error 错误实例
   * @param params 本次请求参数
   */
  onError?: (error: Error, params: P) => void
  /**
   * @desc 请求结束(无论成功、失败、缓存命中)时触发
   * @param params 本次请求参数
   */
  onAfter?: (params: P) => void
}

/**
 * useRequest 配置项
 */
export interface UseRequestOptions<
  R,
  P extends unknown[],
> extends RequestCallbacks<R, P> {
  /**
   * @desc 是否手动执行,false 时在初始化阶段自动请求一次
   * @default false
   */
  manual?: boolean
  /**
   * @desc 自动请求使用的默认参数
   * @default undefined
   */
  defaultParams?: P
  /**
   * @desc 是否满足请求条件,false 时不会真正调用 service
   * @default true
   */
  ready?: MaybeRefOrGetter<boolean>
  /**
   * @desc 依赖项,发生变化时重新请求(manual 模式下同样生效)
   * @default undefined
   */
  refreshDeps?: WatchSource | WatchSource[]
  /**
   * @desc 防抖间隔,>0 时 run 走防抖调度
   * @default undefined
   */
  debounceInterval?: MaybeRefOrGetter<number | undefined>
  /**
   * @desc 防抖配置
   * @default { leading: false, trailing: true }
   */
  debounceOptions?: DebounceOptions
  /**
   * @desc 节流间隔,>0 且未配置防抖时 run 走节流调度
   * @default undefined
   */
  throttleInterval?: MaybeRefOrGetter<number | undefined>
  /**
   * @desc 节流配置
   * @default { leading: true, trailing: true }
   */
  throttleOptions?: ThrottleOptions
  /**
   * @desc 轮询间隔,>0 时开启轮询
   * @default undefined
   */
  pollingInterval?: MaybeRefOrGetter<number | undefined>
  /**
   * @desc 页面隐藏时是否继续轮询
   * @default false
   */
  pollingWhenHidden?: boolean
  /**
   * @desc 浏览器离线时是否继续轮询
   * @default false
   */
  pollingWhenOffline?: boolean
  /**
   * @desc 窗口聚焦或页面重新可见时是否刷新
   * @default false
   */
  refreshOnWindowFocus?: MaybeRefOrGetter<boolean>
  /**
   * @desc 聚焦刷新的最小间隔,用于限制短时间内重复刷新
   * @default 5000
   */
  refocusTimespan?: MaybeRefOrGetter<number | undefined>
  /**
   * @desc 缓存 key,相同 key 共享缓存与进行中的请求
   * @default undefined
   */
  cacheKey?: string | ((params: P) => string)
  /**
   * @desc 缓存存活时间(毫秒),超过后缓存失效;小于 0 表示永不过期
   * @default 600000
   */
  cacheTime?: number
  /**
   * @desc 缓存新鲜时间(毫秒),未过期时直接使用缓存且不发请求;-1 表示永不过期
   * @default 0
   */
  staleTime?: number
  /**
   * @desc 失败重试次数,0 表示不重试
   * @default 0
   */
  errorRetryCount?: MaybeRefOrGetter<number | undefined>
  /**
   * @desc 失败重试间隔,未配置时使用指数退避
   * @default undefined
   */
  errorRetryInterval?: MaybeRefOrGetter<number | undefined>
}

/**
 * useRequest 返回值
 */
export interface UseRequestReturn<R, P extends unknown[]> {
  /**
   * @desc 请求数据,失败时保留上一次成功的数据
   */
  data: ShallowRef<R | undefined>
  /**
   * @desc 是否处于请求中
   */
  loading: Ref<boolean>
  /**
   * @desc 最近一次错误,成功后会被清空
   */
  error: ShallowRef<Error | undefined>
  /**
   * @desc 最近一次执行使用的参数
   */
  params: Ref<P>
  /**
   * @desc 手动执行,内部捕获异常
   */
  run: (...params: P) => void
  /**
   * @desc 手动执行并返回真实 Promise
   */
  runAsync: (...params: P) => Promise<R>
  /**
   * @desc 取消当前请求的提交、轮询、调度与重试
   */
  cancel: () => void
  /**
   * @desc 使用最近一次参数重新请求
   */
  refresh: () => void
  /**
   * @desc 使用最近一次参数重新请求并返回 Promise
   */
  refreshAsync: () => Promise<R>
  /**
   * @desc 本地修改数据,配置了 cacheKey 时同步写入缓存
   */
  mutate: (data: R | ((oldData: R | undefined) => R)) => R
}

/**
 * 全局配置项,不包含实例级配置(参数、缓存 key、依赖、回调)
 */
export type GlobalRequestOptions = Omit<
  UseRequestOptions<unknown, unknown[]>,
  | 'defaultParams'
  | 'cacheKey'
  | 'refreshDeps'
  | 'onBefore'
  | 'onSuccess'
  | 'onError'
  | 'onAfter'
>

/**
 * 归一化后的配置项,保证所有字段都有确定取值
 */
export interface NormalizedRequestOptions<
  R,
  P extends unknown[],
> extends RequestCallbacks<R, P> {
  manual: boolean
  defaultParams: P | undefined
  ready: MaybeRefOrGetter<boolean>
  refreshDeps: WatchSource | WatchSource[] | undefined
  debounceInterval: MaybeRefOrGetter<number | undefined> | undefined
  debounceOptions: Required<Omit<DebounceOptions, 'maxWait'>> & {
    maxWait: number | undefined
  }
  throttleInterval: MaybeRefOrGetter<number | undefined> | undefined
  throttleOptions: Required<ThrottleOptions>
  pollingInterval: MaybeRefOrGetter<number | undefined> | undefined
  pollingWhenHidden: boolean
  pollingWhenOffline: boolean
  refreshOnWindowFocus: MaybeRefOrGetter<boolean>
  refocusTimespan: MaybeRefOrGetter<number | undefined> | undefined
  cacheKey: string | ((params: P) => string) | undefined
  cacheTime: number
  staleTime: number
  errorRetryCount: MaybeRefOrGetter<number | undefined> | undefined
  errorRetryInterval: MaybeRefOrGetter<number | undefined> | undefined
}
