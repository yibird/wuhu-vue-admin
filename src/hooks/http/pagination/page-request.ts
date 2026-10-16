import type { PageResult, Result } from '#/http'

/**
 * 分页查询字段,会与业务查询参数合并后传给分页 service
 */
export interface PageQuery {
  /**
   * @desc 当前页码,从 1 开始
   */
  current?: number
  /**
   * @desc 每页条数
   */
  pageSize?: number
}

/**
 * 分页接口响应,兼容统一包装 Result<PageResult<T>> 与直接返回 PageResult<T>
 */
export type PageResponse<T> = Result<PageResult<T>> | PageResult<T>

/**
 * 分页请求函数
 *
 * 入参为「业务查询参数 + 分页字段」合并后的完整查询对象。
 */
export type PageService<T, Q extends PageQuery> = (
  query: Q
) => Promise<PageResponse<T>>

/**
 * 默认分页数据提取,自动解包业务统一包装
 *
 * 判定规则:响应中带有 list 字段视为 PageResult,否则读取 Result.data。
 *
 * @param response 接口响应
 * @returns 分页数据
 */
export function selectPageData<T>(response: PageResponse<T>): PageResult<T> {
  return 'list' in response ? response : response.data
}

/**
 * 合并业务查询参数与分页字段
 * @param filters 业务查询参数
 * @param current 页码
 * @param pageSize 每页条数
 * @returns 查询对象
 */
export function buildPageQuery<Q extends PageQuery>(
  filters: Partial<Q>,
  current: number,
  pageSize: number
): Q {
  return { ...filters, current, pageSize } as Q
}

/**
 * 归一化页码与每页条数,保证为 >=1 的整数
 * @param value 原始值
 * @param fallback 非法值兜底
 * @returns 归一化结果
 */
export function normalizePageValue(value: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback
  return Math.max(1, Math.trunc(value))
}
