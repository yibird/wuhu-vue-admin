import type { BaseResp } from '#/http'

export interface DeptResp extends BaseResp {
  /**
   * @desc 部门名称
   */
  name: string
  /**
   * @desc 部门编码
   */
  code: string
  /**
   * @desc 部门类型(1:部门,2:岗位)
   */
  type: number
  /**
   * @desc 部门负责人
   */
  leader: string
  /**
   * @desc 联系电话
   */
  phone: string
  /**
   * @desc 邮箱
   */
  email: string
}

export interface CreateDeptReq {}

export interface UpdateDeptReq {
  id: string
}
