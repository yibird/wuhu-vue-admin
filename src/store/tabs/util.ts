import { omit } from 'es-toolkit'

import type { IMenu, ITab } from '#/config'

/**
 * @desc 将菜单转换为标签页
 * @param menu 菜单
 * @returns 标签页
 */
export function menuToTab(menu: IMenu): ITab {
  if ((menu.type !== 1 && menu.type !== 2) || !menu.path) {
    throw new Error(`Menu ${menu.id} is not a route menu`)
  }
  return {
    ...omit(menu, ['children']),
    name: String(menu.id),
    path: menu.path,
    fixed: menu.fixed ?? false,
    home: menu.home ?? false,
    keepAlive: menu.keepAlive ?? true,
  }
}

/**
 * @desc 将菜单数组转换为标签页数组
 * @param menus 菜单数组
 * @returns 标签页数组
 */
export function menusToTabs(menus: IMenu[]): ITab[] {
  return menus
    .filter((menu) => menu.type === 1 || menu.type === 2)
    .map(menuToTab)
}
