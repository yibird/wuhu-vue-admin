import { defineStore, storeToRefs } from 'pinia'
import { treeToList } from '@zhouchengfeng/okay'
import type { IMenu } from '#/config'
import type { PermissionState } from './types'

const createInitialState = (): PermissionState => ({
  menus: [],
  flatMenus: [],
  flatMenusCache: new Map<string, IMenu>(),
  permissions: [],
  menusVersion: 0,
})

export const permissionStore = defineStore('permission', {
  state: createInitialState,
  actions: {
    setMenus(menus: IMenu[], permissions?: string[]) {
      const flatMenus = treeToList(menus)
      const flatMenusCache = new Map(flatMenus.map((m) => [m.id, m]))
      const derivedPermissions = flatMenus.flatMap((item) =>
        item.permission ? [item.permission] : []
      )
      Object.assign(this, {
        menus,
        flatMenus,
        flatMenusCache,
        permissions: permissions ?? derivedPermissions,
        menusVersion: this.menusVersion + 1,
      })
    },
    clear() {
      Object.assign(this, createInitialState(), {
        menusVersion: this.menusVersion + 1,
      })
    },
  },
})

export const usePermissionStore = () => {
  const store = permissionStore()
  return { ...store, ...storeToRefs(store) }
}
