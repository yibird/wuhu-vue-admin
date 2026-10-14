import { markRaw } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { treeToList } from '@zhouchengfeng/okay'
import { isMenuPermission, isMenuRoute } from '@/router/utils'
import type { IMenu } from '#/config'

export const permissionStore = defineStore('permission', {
  state: () => {
    return {
      menus: [] as IMenu[],
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
      return this.flatMenus.filter((item) => isMenuRoute(item))
    },
    /**
     * 权限列表
     */
    permissions(): string[] {
      return this.flatMenus
        .filter((item) => isMenuPermission(item))
        .map((item) => item.permission)
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
        if (isMenuRoute(menu)) {
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
    clear() {
      this.$reset()
    },
  },
  persist: true,
})

export const usePermissionStore = () => {
  const store = permissionStore()
  return { ...store, ...storeToRefs(store) }
}
