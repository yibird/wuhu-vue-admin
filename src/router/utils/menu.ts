import { isUrl } from '@/utils'
import type { IMenu, MenuType } from '#/config'

/**
 * 参与路由注册的菜单类型(菜单与子菜单)
 */
const ROUTE_MENU_TYPES: MenuType[] = [2, 3]

/**
 * 可作为权限来源的菜单类型(目录之外的节点)
 */
const PERMISSION_MENU_TYPES: MenuType[] = [2, 3, 4]

/**
 * 判断是否为路由菜单(非外链)
 * @param menu 菜单项
 * @returns true 表示是路由菜单,false 表示是外链或无效菜单
 */
export function isMenu(menu: IMenu): menu is RequiredKeys<IMenu, 'path'> {
  return (
    ROUTE_MENU_TYPES.includes(menu.type) && !!menu.path && !isUrl(menu.path)
  )
}

/**
 * 判断菜单是否是菜单权限
 *
 * @param menu 菜单
 * @returns 返回一个布尔值,表示是否是菜单或权限按钮
 */
export function isMenuPermission(menu: IMenu): menu is IMenu & {
  permission: string
} {
  return PERMISSION_MENU_TYPES.includes(menu.type) && !!menu.permission
}

/**
 * 判断菜单是否参与全局搜索
 *
 * 只收菜单(type 2):目录(type 1)没有落地页;子页面(type 3,例如详情页)依赖路由参数,
 * 直接跳转只会打开空页面,因此不进搜索结果。外链仍可被搜索到。
 *
 * @param menu 菜单项
 */
export function isSearchableMenu(menu: IMenu) {
  return menu.type === 2 && !!menu.path && !menu.disabled
}
