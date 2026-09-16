import type { BaseResp } from '#/http'

export interface DictQuery {
  pageNum?: number
  pageSize?: number
  name?: string
  type?: string
  status?: boolean
}

export interface DictResp extends BaseResp {
  /**
   * @desc 字典名称
   */
  name: string
  /**
   * @desc 字典类型
   */
  type: string
  /**
   * @desc 字典状态(true正常,false停用)
   */
  status: boolean
}

export interface CreateDictReq {
  name: string
  type: string
  status: boolean
  remark?: string
}

export interface UpdateDictReq extends Partial<CreateDictReq> {
  id: string
}

export interface DictItemResp extends BaseResp {
  /**
   * @desc 所属字典ID
   */
  dictId: string
  /**
   * @desc 字典项标签
   */
  label: string
  /**
   * @desc 字典项值
   */
  value: string
  /**
   * @desc 字典项状态(true正常,false停用)
   */
  status: boolean
}

export interface DictItemQuery {
  pageNum?: number
  pageSize?: number
  dictId?: string
  label?: string
  value?: string
  status?: boolean
}

export interface CreateDictItemReq {
  dictId: string
  label: string
  value: string
  sort: number
  status: boolean
  remark?: string
}

export interface UpdateDictItemReq extends Partial<CreateDictItemReq> {
  id: string
}
