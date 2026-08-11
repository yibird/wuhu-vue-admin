import { defineStore, storeToRefs } from 'pinia'
import { getAuthSessionApi, loginApi } from '@/apis'
import { ApiCode } from '@/constants'
import { getToken, removeToken, setToken } from '@/utils'
import { onSessionExpired } from '@/utils/http/sessionEvents'
import { permissionStore } from '../permission'
import { tabStore } from '../tabs'

import type { LoginRequest } from '@/apis'
import type { AuthState } from './types'

let restorePromise: Promise<void> | null = null

const createInitialState = (): AuthState => ({
  accessToken: getToken(),
  user: null,
  loginLoading: false,
  sessionLoading: false,
})

export const authStore = defineStore('auth', {
  state: createInitialState,
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    applySession(
      session: {
        user: NonNullable<AuthState['user']>
        permissions: string[]
      },
      accessToken?: string
    ) {
      if (accessToken) {
        this.accessToken = accessToken
        setToken(accessToken)
      }
      this.user = session.user
      permissionStore().setPermissions(session.permissions)
    },
    async login(credentials: LoginRequest) {
      this.loginLoading = true
      try {
        const response = await loginApi(credentials)
        if (response.code !== ApiCode.Ok || !response.data) {
          throw new Error(response.message || '登录失败')
        }
        this.applySession(response.data, response.data.accessToken)
      } finally {
        this.loginLoading = false
      }
    },
    async restoreSession() {
      if (!this.accessToken) throw new Error('NO_AUTH_TOKEN')
      if (this.user) return
      if (restorePromise) return restorePromise

      this.sessionLoading = true
      restorePromise = (async () => {
        try {
          const response = await getAuthSessionApi()
          if (response.code !== ApiCode.Ok || !response.data) {
            throw new Error(response.message || '会话已失效')
          }
          this.applySession(response.data)
        } catch (error) {
          this.clearSession()
          throw error
        } finally {
          this.sessionLoading = false
          restorePromise = null
        }
      })()
      return restorePromise
    },
    clearSession() {
      removeToken()
      this.$reset()
      permissionStore().clearPermissions()
      tabStore().$reset()
    },
  },
})

export const useAuthStore = () => {
  const store = authStore()
  return { ...store, ...storeToRefs(store) }
}

let stopSessionSync: (() => void) | null = null

export function setupAuthSessionSync() {
  stopSessionSync ??= onSessionExpired(() => authStore().clearSession())
  return stopSessionSync
}
