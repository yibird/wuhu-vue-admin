import { defineStore, storeToRefs } from 'pinia'
import { getAuthSessionApi, loginApi } from '@/apis'
import { menus } from '@/config'
import { getToken, removeToken, setToken } from '@/utils'
import { dictStore } from '../dict'
import { permissionStore } from '../permission'
import { tabsStore } from '../tabs'

import type { LoginRequest } from '@/apis'
import type { AuthState } from './types'

const createInitialState = (): AuthState => ({
  accessToken: getToken(),
  userInfo: null,
  loginLoading: false,
  isAuthenticated: false,
})

export const authStore = defineStore('auth', {
  state: createInitialState,
  actions: {
    async login(credentials: LoginRequest) {
      this.loginLoading = true
      try {
        const res = await loginApi(credentials)
        if (res.code !== 0) {
          throw new Error(res.message || '登录失败')
        }
        const { accessToken, user, permissions } = res.data
        this.accessToken = accessToken
        this.userInfo = user
        this.isAuthenticated = true
        setToken(accessToken)
        permissionStore().setMenus(menus)
        permissionStore().setSessionPermissions(permissions)
      } finally {
        this.loginLoading = false
      }
    },

    async restoreSession() {
      if (!this.accessToken) return false
      if (this.userInfo) {
        if (permissionStore().menus.length === 0) {
          permissionStore().setMenus(menus)
        }
        return true
      }
      try {
        const response = await getAuthSessionApi()
        const session = response.data
        if (!session?.user) {
          this.logout()
          return false
        }
        this.userInfo = session.user
        permissionStore().setMenus(menus)
        permissionStore().setSessionPermissions(session.permissions)
        return true
      } catch {
        this.logout()
        return false
      }
    },

    logout() {
      removeToken()
      dictStore().clearAllDict()
      permissionStore().clear()
      tabsStore().$reset()
      this.$reset()
    },
  },
})

export const useAuthStore = () => {
  const store = authStore()
  return { ...store, ...storeToRefs(store) }
}
