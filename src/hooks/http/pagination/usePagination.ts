import { computed, shallowRef } from 'vue'
import { useRequest } from '../request/index.ts'
import { noop } from '../request/utils.ts'
import {
  buildPageQuery,
  normalizePageValue,
  selectPageData,
  type PageQuery,
  type PageResponse,
  type PageService,
} from './page-request.ts'

import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { PageResult } from '#/http'
import type { UseRequestOptions } from '../request/types.ts'

/**
 * usePagination 配置项
 */
export interface UsePaginationOptions<T, Q extends PageQuery> extends Omit<
  UseRequestOptions<PageResult<T>, [Q]>,
  'defaultParams'
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
}

/**
 * 分页状态与操作
 */
export interface PaginationState {
  /**
   * @desc 当前页码
   */
  pageNum: Ref<number>
  /**
   * @desc 每页条数
   */
  pageSize: Ref<number>
  /**
   * @desc 总条数
   */
  total: ComputedRef<number>
  /**
   * @desc 总页数
   */
  totalPage: ComputedRef<number>
  /**
   * @desc 切换页码并重新请求
   */
  changePageNum: (pageNum: number) => void
  /**
   * @desc 切换每页条数(自动回到第 1 页)并重新请求
   */
  changePageSize: (pageSize: number) => void
  /**
   * @desc 同时切换页码与每页条数并重新请求
   */
  changePage: (pageNum: number, pageSize?: number) => void
}

/**
 * usePagination 返回值
 */
export interface UsePaginationReturn<T, Q extends PageQuery> {
  /**
   * @desc 当前页数据列表
   */
  list: ComputedRef<T[]>
  /**
   * @desc 最近一次分页响应
   */
  data: ShallowRef<PageResult<T> | undefined>
  /**
   * @desc 是否请求中
   */
  loading: Ref<boolean>
  /**
   * @desc 最近一次错误
   */
  error: ShallowRef<Error | undefined>
  /**
   * @desc 最近一次请求参数
   */
  params: Ref<[Q]>
  /**
   * @desc 分页状态与操作
   */
  pagination: PaginationState
  /**
   * @desc 以新的业务查询参数发起请求(页码回到第 1 页),内部捕获异常
   */
  run: (params?: Partial<Q>) => void
  /**
   * @desc 以新的业务查询参数发起请求(页码回到第 1 页)
   */
  runAsync: (params?: Partial<Q>) => Promise<PageResult<T>>
  /**
   * @desc 使用当前页码与业务查询参数重新请求
   */
  refresh: () => void
  /**
   * @desc 使用当前页码与业务查询参数重新请求
   */
  refreshAsync: () => Promise<PageResult<T>>
  /**
   * @desc 本地修改分页数据,配置了 cacheKey 时同步写入缓存
   */
  mutate: (
    data:
      | PageResult<T>
      | ((oldData: PageResult<T> | undefined) => PageResult<T>)
  ) => PageResult<T>
  /**
   * @desc 取消当前请求的提交、轮询、调度与重试
   */
  cancel: () => void
}

/**
 * 分页请求 Hooks
 *
 * 在 useRequest 之上管理页码状态与业务查询参数,所有请求依旧经过同一个请求核心,
 * 因此 manual/ready/debounce/throttle/polling/cache/retry/竞态/生命周期清理全部继承。
 *
 * @param service 分页请求函数,接收「业务参数 + 分页字段」合并后的查询对象
 * @param options 分页配置
 * @returns 分页数据、状态与操作
 */
export function usePagination<T, Q extends PageQuery = PageQuery>(
  service: PageService<T, Q>,
  options: UsePaginationOptions<T, Q> = {}
): UsePaginationReturn<T, Q> {
  const {
    defaultPageNum = 1,
    defaultPageSize = 10,
    defaultParams,
    ...requestOptions
  } = options
  const select = options.select ?? selectPageData

  const pageNum = shallowRef(normalizePageValue(defaultPageNum, 1))
  const pageSize = shallowRef(normalizePageValue(defaultPageSize, 10))
  const filters = shallowRef<Partial<Q>>(
    defaultParams === undefined ? {} : { ...defaultParams }
  )

  const request = useRequest<PageResult<T>, [Q]>(
    async (query) => select(await service(query)),
    {
      ...requestOptions,
      // 自动请求使用当前分页状态构造的查询对象
      defaultParams: [buildQuery()],
    }
  )

  function buildQuery(
    nextPageNum = pageNum.value,
    nextPageSize = pageSize.value
  ): Q {
    return buildPageQuery<Q>(filters.value, nextPageNum, nextPageSize)
  }

  function refreshAsync(): Promise<PageResult<T>> {
    return request.runAsync(buildQuery())
  }

  function refresh(): void {
    void refreshAsync().catch(noop)
  }

  function runAsync(params?: Partial<Q>): Promise<PageResult<T>> {
    if (params !== undefined) {
      const { pageNum: nextPageNum, pageSize: nextPageSize, ...rest } = params
      // 新的查询条件:整体替换业务参数,页码回到第 1 页(显式传入分页字段时以传入值为准)
      filters.value = rest as Partial<Q>
      if (nextPageSize !== undefined) {
        pageSize.value = normalizePageValue(nextPageSize, pageSize.value)
      }
      pageNum.value =
        nextPageNum !== undefined ? normalizePageValue(nextPageNum, 1) : 1
    }
    return request.runAsync(buildQuery())
  }

  function run(params?: Partial<Q>): void {
    void runAsync(params).catch(noop)
  }

  function changePageNum(nextPageNum: number): void {
    pageNum.value = normalizePageValue(nextPageNum, 1)
    refresh()
  }

  function changePageSize(nextPageSize: number): void {
    pageSize.value = normalizePageValue(nextPageSize, pageSize.value)
    pageNum.value = 1
    refresh()
  }

  function changePage(nextPageNum: number, nextPageSize?: number): void {
    if (nextPageSize !== undefined) {
      pageSize.value = normalizePageValue(nextPageSize, pageSize.value)
    }
    pageNum.value = normalizePageValue(nextPageNum, 1)
    refresh()
  }

  const list = computed(() => request.data.value?.list ?? [])

  const total = computed(() => request.data.value?.total ?? 0)

  const totalPage = computed(() => {
    const response = request.data.value
    if (response?.totalPage !== undefined) return response.totalPage
    return pageSize.value > 0 ? Math.ceil(total.value / pageSize.value) : 0
  })

  return {
    list,
    data: request.data,
    loading: request.loading,
    error: request.error,
    params: request.params,
    pagination: {
      pageNum,
      pageSize,
      total,
      totalPage,
      changePageNum,
      changePageSize,
      changePage,
    },
    run,
    runAsync,
    refresh,
    refreshAsync,
    mutate: request.mutate,
    cancel: request.cancel,
  }
}
