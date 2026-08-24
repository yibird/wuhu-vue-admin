import { permissionStore, tabStore } from '@/store'
import { isMenu, normalizePath } from '../utils'

import type { RouterPlugin } from './types'
import type { IMenu } from '#/config'

let menuPathIndexCache:
  | {
      source: Map<string, IMenu>
      size: number
      index: Map<string, IMenu>
    }
  | undefined

/**
 * 创建菜单路径索引
 *
 * 将菜单 path 映射为 Menu，方便路由切换时快速查找
 */
function getMenuPathIndex(menus: Map<string, IMenu>): Map<string, IMenu> {
  if (
    menuPathIndexCache?.source === menus &&
    menuPathIndexCache.size === menus.size
  ) {
    return menuPathIndexCache.index
  }
  const index = new Map<string, IMenu>()
  for (const menu of menus.values()) {
    if (!isMenu(menu) || !menu.path) {
      continue
    }
    index.set(normalizePath(menu.path), menu)
  }
  menuPathIndexCache = {
    source: menus,
    size: menus.size,
    index,
  }
  return index
}

/**
 * 根据当前路由激活对应 Tab
 */
function activateRouteTab(path: string) {
  const normalizedPath = normalizePath(path)
  const { flatMenusCache } = permissionStore()
  const { openTab } = tabStore()
  const menu = getMenuPathIndex(flatMenusCache).get(normalizedPath)
  if (!menu) return
  openTab(String(menu.id))
}

/**
 * 路由 Tab 联动插件
 */
export const routeTabPlugin: RouterPlugin = {
  name: 'route-tab',
  hooks: {
    onAfterEach(to) {
      activateRouteTab(to.path)
    },
  },
}
