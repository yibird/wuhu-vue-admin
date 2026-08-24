import type { BaseResp } from '#/http'

export type MenuType = 1 | 2 | 3

export interface MenuResp extends BaseResp {
  /**
   * @desc 菜单名称
   */
  name: string
  /**
   * @desc 菜单类型(1目录,2菜单,3按钮)
   */
  type: MenuType
  /**
   * @desc 路由地址
   */
  path: string
  /**
   * @desc 组件路径
   */
  component: string
  /**
   * @desc 权限标识
   */
  perms: string
  /**
   * @desc 图标
   */
  icon: string
  /**
   * @desc 排序
   */
  sort: number
  /**
   * @desc 状态(true正常,false停用)
   */
  status: boolean
}

export interface CreateMenuReq {
  name: string
  type: MenuType
  path: string
  component: string
  perms: string
  icon: string
  sort: number
  status: boolean
  remark?: string
}

export interface UpdateMenuReq extends Partial<CreateMenuReq> {
  id: string
}
