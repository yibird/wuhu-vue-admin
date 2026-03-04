import { useRequest } from 'vue-request'
import { apiRequest } from '@/utils'
import { useRowSelection } from '../..'
import { usePagination } from './usePagination'

import type { Result, PageResult } from '#/http'
import type { PaginationProps } from 'naive-ui'

type Data<T> = Result<PageResult<T>>
type Api<T, P> = string | ((params: P) => Promise<Data<T>>) | Promise<Data<T>>

export interface UseTableOptions<T, P> {
  /**
   * @description 请求api,可以是api url,也可以是Promise或者返回一个Promise的函数
   * @default
   */
  api: Api<T, P>
  /**
   * @desc api请求参数
   * @default {}
   */
  params?: P
  /**
   * @desc rowKey属性
   * @default
   */
  rowKey?: (row: T) => string | number

  /**
   * @desc 分页的初始值
   * @default
   */
  initialPagination?: PaginationProps

  /**
   * 数据转换函数
   * @param data 数据
   * @returns 转换后的数据
   */
  transformData?: (data: Data<T>) => T[]

  /**
   * 切换分页时回调
   * @param page 当前分页
   * @param pageSize 每页显示数量
   * @returns void
   */
  onPaginate?: (page: number, pageSize: number) => void

  onSuccess?: (data: Data<T>, params: P) => void
  onError?: (error: Error, params: P) => void
  onBefore?: (params: P) => void
  onAfter?: (params: P) => void
}

function getPromise<T, P>(
  api: Api<T, P>,
  params: P | undefined
): () => Promise<Data<T>> {
  if (typeof api === 'function') {
    return () => api(params as P)
  }
  if (typeof api === 'string') {
    return () => {
      return apiRequest<Data<T>>(api, {
        searchParams: params ?? {},
      })
    }
  }
  return () => api
}

export function useTable<
  T extends Record<string, any>,
  P extends Record<string, any> | undefined = undefined,
>(options: UseTableOptions<T, P>) {
  const {
    api,
    params,
    rowKey,
    initialPagination,
    transformData,
    onPaginate,
    onSuccess,
    onAfter,
    onBefore,
    onError,
  } = options

  const apiPromise = getPromise<T, P>(api, params)

  const { data, loading, error, run, runAsync } = useRequest<Data<T>, [P]>(
    apiPromise,
    {
      onSuccess: (data, params) => onSuccess?.(data, params[0]),
      onAfter: (params) => onAfter?.(params[0]),
      onBefore: (params) => onBefore?.(params[0]),
      onError: (error, params) => onError?.(error, params[0]),
    }
  )

  const total = computed(() => data.value?.data?.total ?? 0)
  const { pagination, changePage, changePageSize } = usePagination({
    initial: initialPagination,
    itemCount: total,
    onPaginate,
  })

  const { rowSelection, selectedAll, selectedKeys, selectedRows, handleCheck } =
    useRowSelection<T>({ rowKey })

  const dataSource = computed(() => {
    if (typeof transformData === 'function' && data.value) {
      return transformData(data.value)
    }
    return data.value?.data?.list ?? []
  })

  return {
    loading,
    data,
    dataSource,
    total,
    error,
    run,
    runAsync,

    // 分页
    pagination,
    changePage,
    changePageSize,

    // 选择列
    rowSelection,
    selectedAll,
    selectedKeys,
    selectedRows,
    handleCheck,
    rowKey,
  }
}
