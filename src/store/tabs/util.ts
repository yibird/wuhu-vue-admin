import { getComponentName } from '@/router'
import type { IMenu, TabOption } from '#/config'
import type { LocationQueryRaw } from 'vue-router'
import type { ITab, TabTarget } from './types'

export function menuToTab(menu: IMenu): ITab {
  return {
    key: menu.id,
    path: menu.path!,
    title: menu.title,
    menuId: menu.id,
    level: menu.level,
    rootId: menu.rootId,
    icon: menu.icon,
    pin: menu.fixed,
    keepAlive: menu.keepAlive,
    query: menu.query as LocationQueryRaw,
    componentName: getComponentName(menu.path!),
  }
}

/**
 * 生成路由 Tab 的 key,同一 path 下 query 不同视为不同 Tab
 *
 * @param path 路由 path
 * @param query 路由 query
 * @returns Tab key
 */
export function toRouteTabKey(path: string, query?: LocationQueryRaw) {
  const params = Object.entries(query ?? {})
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) =>
      Array.isArray(value) ? `${key}=${value.join(',')}` : `${key}=${value}`
    )
  return params.length ? `${path}?${params.join('&')}` : path
}

/**
 * 将路由 Tab 参数转换为 Tab 项
 *
 * 菜单信息用于补全标题、图标与面包屑层级,缺失时退化为纯路由 Tab
 *
 * @param option 路由 Tab 参数
 * @param menu path 对应的菜单
 * @returns Tab 项
 */
export function toRouteTab(option: TabOption, menu?: IMenu): ITab {
  return {
    key: toRouteTabKey(option.path, option.query),
    path: option.path,
    title: option.title ?? menu?.title ?? option.path,
    menuId: menu?.id,
    level: menu?.level,
    rootId: menu?.rootId,
    icon: option.icon ?? menu?.icon,
    query: option.query,
    pin: menu?.fixed,
    keepAlive: menu?.keepAlive,
    componentName: getComponentName(option.path),
  }
}

/**
 * 获取 Tab 在列表中的下标
 *
 * @param tabs tab列表
 * @param target 菜单key、tab下标、tab option
 * @returns
 */
export function getTabIndex(tabs: ITab[], target: TabTarget) {
  if (typeof target === 'number') return target
  const key = typeof target === 'string' ? target : target.key
  return tabs.findIndex((tab) => tab.key === key)
}

/**
 * 对 Tab 列表进行排序
 *
 * 固定 Tab 排在未固定 Tab 前面，并保持各自原有的顺序。
 *
 * @param tabs Tab 列表
 * @returns 返回排序后的 Tab 列表
 */
export function sortPinTabs(tabs: ITab[]) {
  const pinnedTabs = tabs.filter((tab) => tab.pin)
  const unpinnedTabs = tabs.filter((tab) => !tab.pin)
  return [...pinnedTabs, ...unpinnedTabs]
}
