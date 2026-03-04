import type { IMenu } from '#/config'

export interface PermissionState {
  // 菜单列表,由服务器返回
  menus: IMenu[]
  // 扁平化菜单,用于简化查找菜单
  flatMenus: IMenu[]
  // 扁平化菜单缓存,用于优化查找菜单,key为菜单id,value为对应菜单
  flatMenusCache: Map<number, IMenu>
  // 权限列表
  permissions: string[]
}
export interface PermissionGetters {}
export interface PermissionAction {}
