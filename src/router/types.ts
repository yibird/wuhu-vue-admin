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
}

export type IRoute = RouteRecordRaw & {
  meta?: IRouteMeta
}
