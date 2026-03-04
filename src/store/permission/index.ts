import { defineStore } from 'pinia'
import { menus } from '@/config'
import { treeToList } from '@/utils'

import type { IMenu } from '#/config'
import type { PermissionState } from './types'

const initialState: PermissionState = {
  menus,
  flatMenus: treeToList(menus),
  flatMenusCache: new Map<number, IMenu>(),
  permissions: [],
}

export const permissionStore = defineStore('permission', {
  state() {
    return initialState
  },
  getters: {},
  actions() {},
  persist: true,
})
