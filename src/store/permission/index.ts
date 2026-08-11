import { defineStore, storeToRefs } from 'pinia'
import { menus } from '@/config'
import { treeToList } from '@zhouchengfeng/okay/coll'
import {
  filterMenusByPermissions,
  hasPermission,
  resolveMenuPermission,
} from './access'

import type { PermissionState } from './types'

function createMenuState(permissions: string[]) {
  const visibleMenus = filterMenusByPermissions(menus, permissions)
  const flatMenus = treeToList(visibleMenus)
  const flatMenusCache = new Map(flatMenus.map((m) => [m.id, m]))
  return { menus: visibleMenus, flatMenus, flatMenusCache }
}

const createInitialState = (): PermissionState => ({
  ...createMenuState([]),
  permissions: [],
})

export const permissionStore = defineStore('permission', {
  state: createInitialState,
  actions: {
    setPermissions(permissions: string[]) {
      const uniquePermissions = [...new Set(permissions.filter(Boolean))]
      this.permissions = uniquePermissions
      Object.assign(this, createMenuState(uniquePermissions))
    },
    clearPermissions() {
      this.$reset()
    },
  },
})

export { filterMenusByPermissions, hasPermission, resolveMenuPermission }

export const usePermissionStore = () => {
  const store = permissionStore()
  return { ...store, ...storeToRefs(store) }
}
