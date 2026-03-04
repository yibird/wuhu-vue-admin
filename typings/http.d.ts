export interface Result<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PageResult<T = unknown> {
  list: T[]
  pageNum: number
  pageSize: number
  total: number
  totalPage: number
}

export type ApiResult<T = unknown> = Result<T>

export interface BaseQuery {
  pageNum?: number
  pageSize?: number
}

export interface BaseResp {
  /**
   * @desc 主键
   */
  id: string
  /**
   * @desc 数据状态(false禁用,true启用)
   */
  dataStatus: boolean
  /**
   * @desc 删除状态(false未删除,true已删除)
   */
  deleted: boolean
  /**
   * @desc 备注
   */
  remark?: string
  /**
   * @desc 版本号
   */
  version?: number
  /**
   * @desc 排序
   */
  sort?: number
  /**
   * @desc 关联id
   */
  unionId?: number
  /**
   * @desc 创建人
   */
  createdBy: string
  /**
   * @desc 修改人
   */
  updatedBy?: string
  /**
   * @desc 删除人
   */
  deletedBy?: string
  /**
   * @desc 创建时间
   */
  createdAt: string
  /**
   * @desc 更新时间
   */
  updatedAt?: string
  /**
   * @desc 删除时间
   */
  deletedAt?: string
}
