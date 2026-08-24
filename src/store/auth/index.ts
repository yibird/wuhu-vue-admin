import { defineStore, storeToRefs } from 'pinia'
import { loginApi } from '@/apis'
import { menus } from '@/config'
import { ApiCode } from '@/constants'
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
        if (response.code !== ApiCode.Ok || !response.data) {
          throw new Error(response.message || '登录失败')
        }

        const { accessToken, user } = response.data
        this.accessToken = accessToken
        this.user = user
        setToken(accessToken)
        setDictCacheScope(`user:${user.id}`)
        permissionStore().setMenus(menus)
      } finally {
        this.loginLoading = false
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
