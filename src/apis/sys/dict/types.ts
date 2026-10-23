import type { BaseModel } from '#/http'

export interface SysDictTypeQuery {
  current?: number
  pageSize?: number
  name?: string
  type?: string
  status?: boolean
}

export interface SysDictType extends BaseModel {
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

export interface SysDictTypeCreateReq {
  name: string
  type: string
  status: boolean
  remark?: string
}

export interface SysDictTypeUpdateReq extends Partial<SysDictTypeCreateReq> {
  id: string
}

export interface SysDictData extends BaseModel {
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

export interface SysDictDataQuery {
  current?: number
  pageSize?: number
  dictId?: string
  label?: string
  value?: string
  status?: boolean
}

export interface SysDictDataCreateReq {
  dictId: string
  label: string
  value: string
  sort: number
  status: boolean
  remark?: string
}

export interface SysDictDataUpdateReq extends Partial<SysDictDataCreateReq> {
  id: string
}
