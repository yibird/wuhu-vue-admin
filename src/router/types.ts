import type { RouteRecordRaw } from 'vue-router'

export interface IRouteMeta {
  /**
   * 菜单id
   */
  id?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 组件名称
   */
  componentName?: string
  /**
   * 是否公开路由
   */
  public?: boolean
  /**
   * 权限标识
   */
  permission?: string
  /**
   * 是否缓存
   */
  keepAlive?: boolean
  /**
   * 是否隐藏在菜单中
   */
  hideInMenu?: boolean
  /**
   * 是否外部链接
   */
  isExternal?: boolean
}

export type IRoute = RouteRecordRaw & {
  meta?: IRouteMeta
}
