import type { IMenu } from '#/config'

export interface PermissionState {
  // 当前会话可用的菜单列表
  menus: IMenu[]
  // 扁平化菜单,用于简化查找菜单
  flatMenus: IMenu[]
  // 扁平化菜单缓存,用于优化查找菜单,key为菜单id,value为对应菜单
  flatMenusCache: Map<string, IMenu>
  // 权限列表
  permissions: string[]
}
