import { defineStore, storeToRefs } from 'pinia'
import { getAuthSessionApi, loginApi } from '@/apis'
import { menus } from '@/config'
import { clearDictCache } from '@/hooks/useDict'
import { getToken, removeToken, setToken } from '@/utils'
import { permissionStore } from '../permission'
import { tabsStore } from '../tabs'

import type { LoginRequest } from '@/apis'
import type { AuthState } from './types'

const createInitialState = (): AuthState => ({
  accessToken: getToken(),
  user: null,
  loginLoading: false,
})

export const authStore = defineStore('auth', {
  state: createInitialState,
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    async login(credentials: LoginRequest) {
      this.loginLoading = true

      try {
        const response = await loginApi(credentials)
        const session = response.data
        if (!session?.accessToken || !session.user) {
          throw new Error(response.message || '登录失败')
        }

        this.accessToken = session.accessToken
        this.user = session.user
        setToken(session.accessToken)
        permissionStore().setMenus(menus)
        permissionStore().setSessionPermissions(session.permissions)
      } finally {
        this.loginLoading = false
      }
    },

    async restoreSession() {
      if (!this.accessToken) return false
      if (this.user) {
        if (permissionStore().menus.length === 0) {
          permissionStore().setMenus(menus)
        }
        return true
      }
      try {
        const response = await getAuthSessionApi()
        const session = response.data
        if (!session?.user) {
          // 会话无效时必须清掉 token:否则守卫看到 token 会把 /login 再送回原路由,
          // 与「无 user 就跳登录」来回弹跳并反复请求会话接口。
          this.logout()
          return false
        }
        this.user = session.user
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
      clearDictCache()
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
