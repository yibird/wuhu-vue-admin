import type { BaseResp } from '#/http'

export interface MenuResp extends BaseResp {
  /**
   * @desc 菜单名称
   */
  name: string
  /**
   * @desc 菜单类型(1目录,2菜单,3按钮)
   */
  type: number
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

export interface CreateMenuReq {}

export interface UpdateMenuReq {
  id: string
}
