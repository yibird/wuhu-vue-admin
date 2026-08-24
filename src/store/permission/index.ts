import { defineStore, storeToRefs } from 'pinia'
import { treeToList } from '@zhouchengfeng/okay'
import type { IMenu } from '#/config'
import type { PermissionState } from './types'

const createInitialState = (): PermissionState => ({
  menus: [],
  flatMenus: [],
  flatMenusCache: new Map<string, IMenu>(),
  permissions: [],
})

export const permissionStore = defineStore('permission', {
  state: createInitialState,
  actions: {
    setMenus(menus: IMenu[]) {
      const flatMenus = treeToList(menus)
      const flatMenusCache = new Map(flatMenus.map((m) => [m.id, m]))
      const permissions = flatMenus.flatMap((item) =>
        item.permission ? [item.permission] : []
      )
      Object.assign(this, {
        menus,
        flatMenus,
        flatMenusCache,
        permissions,
      })
    },
    clear() {
      Object.assign(this, createInitialState())
    },
  },
})

export const usePermissionStore = () => {
  const store = permissionStore()
  return { ...store, ...storeToRefs(store) }
}
