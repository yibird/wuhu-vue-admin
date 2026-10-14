import { isUrl } from '@/utils'
import type { IMenu } from '#/config'

/**
 * 判断是否为路由菜单(非外链)
 * @param menu 菜单项
 * @returns true 表示是路由菜单,false 表示是外链或无效菜单
 */
export function isMenu(menu: IMenu): menu is RequiredKeys<IMenu, 'path'> {
  return [2, 3].includes(menu.type) && !!menu.path && !isUrl(menu.path)
}

/**
 * 判断menu是否是菜单(包含菜单和子菜单)
 *
 * @param menu 菜单
 * @returns 返回一个布尔值,表示是否是菜单或子页面
 */
export function isMenuRoute(menu: IMenu): menu is IMenu & {
  path: string
} {
  return (menu.type === 2 || menu.type === 3) && !!menu.path
}

/**
 * 判断菜单是否是菜单权限
 *
 * @param menu 菜单
 * @returns 返回一个布尔值,表示是否是子页面或权限按钮
 */
export function isMenuPermission(menu: IMenu): menu is IMenu & {
  permission: string
} {
  return (menu.type === 3 || menu.type === 4) && !!menu.permission
}

/**
 * 判断菜单是否是子页面
 *
 * @param menu 菜单
 * @returns 返回一个布尔值,表示是否是子页面
 */
export function isSubMenu(menu: IMenu): menu is IMenu & {
  path: string
} {
  return menu.type === 3 && !!menu.path
}
