import { defineStore, storeToRefs } from 'pinia'
import { getAuthSessionApi, loginApi } from '@/apis'
import { menus } from '@/config'
import { clearDictCache, setDictCacheScope } from '@/composables/useDict'
import { getToken, removeToken, setToken } from '@/utils'
import { permissionStore } from '../permission'
import { tabStore } from '../tabs'

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
        setDictCacheScope(`user:${session.user.id}`)
        permissionStore().setMenus(menus, session.permissions)
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
        if (!session?.user) return false

        this.user = session.user
        setDictCacheScope(`user:${session.user.id}`)
        permissionStore().setMenus(menus, session.permissions)
        return true
      } catch {
        this.logout()
        return false
      }
    },

    logout() {
      removeToken()
      clearDictCache()
      setDictCacheScope('anonymous')
      permissionStore().clear()
      tabStore().$reset()
      this.$reset()
    },
  },
})

export const useAuthStore = () => {
  const store = authStore()
  return { ...store, ...storeToRefs(store) }
}
