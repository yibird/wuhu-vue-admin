import type { BaseResp } from '#/http'

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

export interface CreateDictReq {}

export interface UpdateDictReq {
  id: string
}
