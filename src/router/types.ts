import type { RouteRecordRaw } from 'vue-router'

export interface IRouteMeta {
  /**
   * @desc 菜单id
   */
  id?: string | number
  /**
   * @desc 标题
   */
  title?: string
  /**
   * @desc 组件名称
   */
  componentName?: string
  /** Whether the route can be visited without an authenticated session. */
  public?: boolean
  /** Permission keys accepted by this route. */
  permission?: string | string[]
  /** Whether the rendered route component should be cached. */
  keepAlive?: boolean
  /** Whether the route is intentionally hidden from navigation. */
  hideInMenu?: boolean
  /** Whether the route points to an external resource. */
  isExternal?: boolean
}

export type IRoute = RouteRecordRaw & {
  meta?: IRouteMeta
}
