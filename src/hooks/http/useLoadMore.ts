import { computed, shallowRef, watch } from 'vue'
import { useRequest } from './request/index.ts'
import { noop, toArray, toError } from './request/utils.ts'
import {
  buildPageQuery,
  normalizePageValue,
  selectPageData,
  type PageQuery,
  type PageResponse,
  type PageService,
} from './pagination/page-request.ts'

import type { PageResult } from '#/http'
import type { UseRequestOptions } from './request/types.ts'
import type { ComputedRef, Ref, ShallowRef, WatchSource } from 'vue'

/**
 * useLoadMore 配置项
 */
export interface UseLoadMoreOptions<T, Q extends PageQuery> extends Omit<
  UseRequestOptions<PageResult<T>, [Q]>,
  'defaultParams' | 'refreshDeps'
> {
  /**
   * @desc 初始页码
   * @default 1
   */
  defaultPageNum?: number
  /**
   * @desc 初始每页条数
   * @default 10
   */
  defaultPageSize?: number
  /**
   * @desc 业务查询参数(不含分页字段)
   * @default {}
   */
  defaultParams?: Partial<Q>
  /**
   * @desc 从响应中提取分页数据,默认自动解包 Result 包装
   * @default selectPageData
   */
  select?: (response: PageResponse<T>) => PageResult<T>
  /**
   * @desc 依赖变化时重新加载(清空列表并回到第 1 页)
   * @default undefined
   */
  refreshDeps?: WatchSource | WatchSource[]
  /**
   * @desc 自定义「没有更多数据」判定
   * @default 依据 total、返回条数与每页条数推断
   */
  isNoMore?: (data: PageResult<T>, list: T[]) => boolean
}

/**
 * useLoadMore 返回值
 */
export interface UseLoadMoreReturn<T, Q extends PageQuery> {
  /**
   * @desc 累积的数据列表
   */
  list: ShallowRef<T[]>
  /**
   * @desc 最近一次分页响应
   */
  data: ShallowRef<PageResult<T> | undefined>
  /**
   * @desc 是否请求中(包含首屏与加载更多)
   */
  loading: Ref<boolean>
  /**
   * @desc 是否正在加载更多
   */
  loadingMore: ShallowRef<boolean>
  /**
   * @desc 是否已经没有更多数据
   */
  noMore: ComputedRef<boolean>
  /**
   * @desc 最近一次错误
   */
  error: ShallowRef<Error | undefined>
  /**
   * @desc 最近一次请求参数
   */
  params: Ref<[Q]>
  /**
   * @desc 当前页码
   */
  current: ShallowRef<number>
  /**
   * @desc 每页条数
   */
  pageSize: ShallowRef<number>
  /**
   * @desc 总条数
   */
  total: ComputedRef<number>
  /**
   * @desc 总页数
   */
  totalPage: ComputedRef<number>
  /**
   * @desc 加载下一页,内部捕获异常
   */
  loadMore: () => void
  /**
   * @desc 加载下一页;没有更多或已有请求在途时直接返回当前数据
   */
  loadMoreAsync: () => Promise<PageResult<T> | undefined>
  /**
   * @desc 重新加载(清空列表并回到第 1 页),内部捕获异常
   */
  reload: () => void
  /**
   * @desc 重新加载(清空列表并回到第 1 页)
   */
  reloadAsync: () => Promise<PageResult<T>>
  /**
   * @desc 本地修改累积列表
   */
  mutate: (list: T[] | ((oldList: T[]) => T[])) => T[]
  /**
   * @desc 取消当前请求的提交、轮询、调度与重试
   */
  cancel: () => void
}

/**
 * 加载更多请求 Hooks
 *
 * 在 useRequest 之上维护「累积列表 + 页码」,通过订阅请求核心提交的数据完成追加,
 * 因此轮询、重试、竞态丢弃等行为依旧由请求核心统一保证。
 *
 * @param service 分页请求函数,接收「业务参数 + 分页字段」合并后的查询对象
 * @param options 加载更多配置
 * @returns 累积列表、状态与操作
 */
export function useLoadMore<T, Q extends PageQuery = PageQuery>(
  service: PageService<T, Q>,
  options: UseLoadMoreOptions<T, Q> = {}
): UseLoadMoreReturn<T, Q> {
  const {
    defaultPageNum = 1,
    defaultPageSize = 10,
    defaultParams,
    refreshDeps,
    isNoMore,
    ...requestOptions
  } = options
  const select = options.select ?? selectPageData

  const current = shallowRef(normalizePageValue(defaultPageNum, 1))
  const pageSize = shallowRef(normalizePageValue(defaultPageSize, 10))
  const filters = shallowRef<Partial<Q>>(
    defaultParams === undefined ? {} : { ...defaultParams }
  )
  const list = shallowRef<T[]>([])
  const loadingMore = shallowRef(false)
  const hasLoaded = shallowRef(false)

  /**
   * 已合并进列表的页码,用于避免重复追加(轮询重放、重复提交同一页)
   */
  const loadedPages = new Set<number>()

  const request = useRequest<PageResult<T>, [Q]>(
    async (query) => select(await service(query)),
    {
      ...requestOptions,
      // 自动请求使用当前分页状态构造的查询对象
      defaultParams: [buildQuery()],
    }
  )

  function buildQuery(
    nextPageNum = current.value,
    nextPageSize = pageSize.value
  ): Q {
    return buildPageQuery<Q>(filters.value, nextPageNum, nextPageSize)
  }

  // 请求核心提交数据后同步累积列表:第 1 页替换,其余页码追加,已加载过的页码忽略
  watch(
    request.data,
    (response) => {
      if (!response) return
      const items = response.list ?? []
      const committedPageNum = normalizePageValue(
        response.current ?? current.value,
        current.value
      )
      hasLoaded.value = true

      if (committedPageNum <= 1) {
        loadedPages.clear()
        loadedPages.add(committedPageNum)
        list.value = [...items]
        return
      }

      if (loadedPages.has(committedPageNum)) return
      loadedPages.add(committedPageNum)
      list.value = [...list.value, ...items]
    },
    { flush: 'sync' }
  )

  const total = computed(() => request.data.value?.total ?? 0)

  const totalPage = computed(() => {
    const response = request.data.value
    if (response?.totalPage !== undefined) return response.totalPage
    return pageSize.value > 0 ? Math.ceil(total.value / pageSize.value) : 0
  })

  const noMore = computed(() => {
    const response = request.data.value
    if (!response) return false
    if (isNoMore) return isNoMore(response, list.value)

    const items = response.list ?? []
    if (items.length === 0) return true
    if (
      typeof response.total === 'number' &&
      list.value.length >= response.total
    ) {
      return true
    }
    const size = response.pageSize ?? pageSize.value
    return items.length < size
  })

  /**
   * 请求指定页码,失败或结果未提交时回退页码,避免跳过该页
   * @param targetPageNum 目标页码
   * @returns 分页响应
   */
  async function loadPage(
    targetPageNum: number
  ): Promise<PageResult<T> | undefined> {
    current.value = targetPageNum
    loadingMore.value = targetPageNum > 1
    try {
      const response = await request.runAsync(buildQuery(targetPageNum))
      if (current.value === targetPageNum && !loadedPages.has(targetPageNum)) {
        // 结果未被提交(取消或被更新的请求取代)
        current.value = Math.max(1, targetPageNum - 1)
      }
      return response
    } catch (cause) {
      if (current.value === targetPageNum) {
        current.value = Math.max(1, targetPageNum - 1)
      }
      throw toError(cause)
    } finally {
      loadingMore.value = false
    }
  }

  async function loadMoreAsync(): Promise<PageResult<T> | undefined> {
    if (noMore.value || request.loading.value) return request.data.value
    // 尚未加载过任何一页时,首次加载第 1 页
    const targetPageNum = hasLoaded.value ? current.value + 1 : 1
    return loadPage(targetPageNum)
  }

  function loadMore(): void {
    void loadMoreAsync().catch(noop)
  }

  function reloadAsync(): Promise<PageResult<T>> {
    loadedPages.clear()
    return loadPage(1).then((response) => {
      return response ?? (request.data.value as PageResult<T>)
    })
  }

  function reload(): void {
    void reloadAsync().catch(noop)
  }

  function mutate(nextList: T[] | ((oldList: T[]) => T[])): T[] {
    const next =
      typeof nextList === 'function' ? nextList(list.value) : nextList
    list.value = [...next]
    return list.value
  }

  const deps = toArray(refreshDeps)
  if (deps.length > 0) {
    watch(deps, () => {
      reload()
    })
  }

  return {
    list,
    data: request.data,
    loading: request.loading,
    loadingMore,
    noMore,
    error: request.error,
    params: request.params,
    current,
    pageSize,
    total,
    totalPage,
    loadMore,
    loadMoreAsync,
    reload,
    reloadAsync,
    mutate,
    cancel: request.cancel,
  }
}
