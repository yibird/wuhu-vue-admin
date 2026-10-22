import type { MenuType } from '#/config'
import type { BaseModel } from '#/http'

export interface SysMenu extends BaseModel {
  /**
   * @desc 菜单名称
   */
  name: string
  /**
   * @desc 菜单类型(1目录、2菜单、3子菜单、4权限按钮)
   */
  type: MenuType
  /**
   * @desc 路由地址
   */
  path: string
  /**
   * @desc 是否为外部链接
   * @default false
   */
  isExternal?: boolean
  /**
   * @desc 外部链接打开方式
   * @default '_blank'
   */
  externalTarget?: '_blank' | '_self'
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

export interface SysMenuCreateReq {
  name: string
  type: MenuType
  path: string
  isExternal?: boolean
  externalTarget?: '_blank' | '_self'
  component: string
  perms: string
  icon: string
  sort: number
  status: boolean
  remark?: string
}

export interface SysMenuUpdateReq extends Partial<SysMenuCreateReq> {
  id: string
}
