import { markRaw } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { treeToList } from '@zhouchengfeng/okay'
import { uniq } from 'es-toolkit'
import { isMenu, isMenuPermission } from '@/router/utils'
import type { IMenu } from '#/config'
import type { PermissionState } from './types'

export const permissionStore = defineStore('permission', {
  state: (): PermissionState => {
    return {
      menus: [],
      sessionPermissions: [],
    }
  },
  getters: {
    /**
     * 扁平化菜单,用于简化查找菜单
     */
    flatMenus(): IMenu[] {
      return treeToList(this.menus)
    },
    /**
     * 获取菜单路由
     * @returns
     */
    flatRoutes(): IMenu[] {
      return this.flatMenus.filter((item) => isMenu(item))
    },
    /**
     * 权限列表,由后端下发的权限码与菜单声明的权限合并而成
     */
    permissions(): string[] {
      const menuPermissions = this.flatMenus
        .filter((item) => isMenuPermission(item))
        .map((item) => item.permission)
      return uniq([...this.sessionPermissions, ...menuPermissions])
    },
    /**
     * 菜单缓存,提供根据id和path查找菜单的映射
     * @returns 包含idMap和pathMap的对象
     */
    menuCache() {
      const idMap: Record<string, IMenu> = {}
      const pathMap: Record<string, IMenu> = {}
      for (const menu of this.flatMenus) {
        Reflect.set(idMap, menu.id, menu)
        if (isMenu(menu)) {
          Reflect.set(pathMap, menu.path, menu)
        }
      }
      return { idMap, pathMap }
    },
  },
  actions: {
    setMenus(menus: IMenu[]) {
      this.menus = markRaw(menus)
    },
    setSessionPermissions(permissions: string[]) {
      this.sessionPermissions = permissions
    },
    clear() {
      this.$reset()
    },
  },
})

export const usePermissionStore = () => {
  const store = permissionStore()
  return { ...store, ...storeToRefs(store) }
}
