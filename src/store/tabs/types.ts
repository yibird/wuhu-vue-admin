import type { ITab } from '#/config'

export type TabOption = string | number | ITab

export interface TabState {
  /**
   * @desc 打开的标签页列表
   * @default []
   */
  tabs: ITab[]
  /**
   * @desc 当前选中的标签页下标,-1表示首页
   * @default -1
   */
  current: number
  /**
   * @desc 顶部菜单
   * @default undefined
   */
  topMenu?: ITab
  /**
   * @desc 根菜单id列表
   * @default []
   */
  rootId?: number | string | null
  /**
   * @desc 是否渲染路由视图,用于刷新路由
   * @default true
   */
  renderRouteView: boolean
  /**
   * @desc 当前打开的标签页列表缓存
   * @default
   */
  cachedTabs: Set<string>
  /**
   * @desc 排除缓存的标签页路径列表
   * @default
   */
  excludeCachedTabs: Set<string>
}
