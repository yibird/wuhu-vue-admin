import { defineStore, storeToRefs } from 'pinia'
import { message } from 'antdv-next'
import { accountLoginApi, getAuthSessionApi, mobileLoginApi } from '@/apis'
import { menus } from '@/config'
import { HTTP_STATUS } from '@/constants'
import { getToken, removeToken, setToken } from '@/utils'
import { dictStore } from '../dict'
import { permissionStore } from '../permission'
import { tabsStore } from '../tabs'

import type { AccountLoginReq, AuthResponse, MobileLoginReq } from '@/apis'
import type { AuthStoreState } from './types'

export const authStore = defineStore('wuhu-vue-admin:auth', {
  state: () => {
    const accessToken = getToken()
    return {
      accessToken,
      userInfo: null,
      loading: false,
      isAuthenticated: Boolean(accessToken),
    } as AuthStoreState
  },
  actions: {
    /**
     * 应用登录/会话响应
     *
     * @param data 登录响应
     */
    applyAuthResponse(data: AuthResponse) {
      this.accessToken = data.accessToken
      this.userInfo = data.userInfo
      this.isAuthenticated = true
      setToken(data.accessToken)
      permissionStore().setMenus(data.menus.length ? data.menus : menus)
    },
    /**
     * 账号密码登录
     *
     * @param req 请求对象
     * @returns 是否登录成功
     */
    async accountLogin(req: AccountLoginReq) {
      this.loading = true
      try {
        const res = await accountLoginApi(req)
        if (res.code !== HTTP_STATUS.Ok) {
          message.error(res.message || '登录失败')
          return false
        }
        this.applyAuthResponse(res.data)
        return true
      } finally {
        this.loading = false
      }
    },
    /**
     * 手机号登录
     *
     * @param req 请求对象
     * @returns 是否登录成功
     */
    async mobileLogin(req: MobileLoginReq) {
      this.loading = true
      try {
        const res = await mobileLoginApi(req)
        if (res.code !== HTTP_STATUS.Ok) {
          message.error(res.message || '登录失败')
          return false
        }
        this.applyAuthResponse(res.data)
        return true
      } finally {
        this.loading = false
      }
    },
    /**
     * 恢复本地 token 对应的会话
     *
     * 刷新页面后 userInfo 为空,不能直接重定向到登录页,否则会和
     * 「已登录访问 /login 时跳回原路由」形成无限重定向。
     *
     * @returns 会话是否有效
     */
    async restoreSession() {
      const token = getToken()
      if (!token) {
        this.$reset()
        return false
      }
      if (this.userInfo) return true
      try {
        const res = await getAuthSessionApi()
        if (res.code !== HTTP_STATUS.Ok || !res.data?.user) {
          this.logout()
          return false
        }
        this.accessToken = token
        this.userInfo = res.data.user
        this.isAuthenticated = true
        permissionStore().setMenus(menus)
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
