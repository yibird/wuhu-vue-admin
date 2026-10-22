import { Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { useGo } from '@/router'
import { authStore } from '@/store'
import type { LoginRequest } from '@/apis'

export function useAuth() {
  const { to } = useGo()
  const store = authStore()
  const { accessToken, loginLoading, isAuthenticated, userInfo } =
    storeToRefs(store)

  function login(credentials: LoginRequest) {
    store.login(credentials)
  }

  function logout() {
    Modal.confirm({
      title: '确定要退出系统吗？',
      cancelText: '取消',
      okText: '确认',
      async onOk() {
        store.logout()
        await to('/login', true)
      },
    })
  }

  function getToken() {
    return accessToken.value
  }

  return {
    isAuthenticated,
    loginLoading,
    userInfo,
    login,
    logout,
    getToken,
  }
}
