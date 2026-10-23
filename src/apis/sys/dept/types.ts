import type { BaseModel } from '#/http'

export type DeptType = 1 | 2

export interface SysDept extends BaseModel {
  /**
   * @desc 上级部门ID，0表示根部门
   */
  parentId: string
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
  type: DeptType
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

export interface SysDeptCreateReq {
  parentId: string
  name: string
  code: string
  type: DeptType
  leader: string
  phone: string
  email: string
  remark?: string
}

export interface SysDeptUpdateReq extends Partial<SysDeptCreateReq> {
  id: string
}
