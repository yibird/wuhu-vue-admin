import { permissionStore, tabStore } from '@/store'
import { isMenu, normalizeRoutePath } from '../utils'
import type { RouterPlugin } from './types'
import type { IMenu } from '#/config'

let indexedMenus: Map<number, IMenu> | undefined
let indexedMenuCount = 0
let menuByPath = new Map<string, IMenu>()

function getMenuPathIndex(menus: Map<number, IMenu>) {
  if (indexedMenus === menus && indexedMenuCount === menus.size) {
    return menuByPath
  }

  menuByPath = new Map()
  for (const menu of menus.values()) {
    if (isMenu(menu)) menuByPath.set(normalizeRoutePath(menu.path!), menu)
  }
  indexedMenus = menus
  indexedMenuCount = menus.size
  return menuByPath
}

function syncCurrentTab(path: string) {
  const normalizedPath = normalizeRoutePath(path)
  const { flatMenusCache } = permissionStore()
  const { openTab } = tabStore()
  const menu = getMenuPathIndex(flatMenusCache).get(normalizedPath)
  if (menu) openTab(String(menu.id))
}

export const syncTabPlugin: RouterPlugin = {
  name: 'sync-tab',
  hooks: {
    onAfterEach(to) {
      syncCurrentTab(to.path)
    },
  },
}
