import { Modal } from 'antdv-next'
import { useGo } from '@/router'
import { useAuthStore } from '@/store'

export function useAuth() {
  const { to } = useGo()
  const {
    accessToken,
    loading,
    isAuthenticated,
    userInfo,
    accountLogin,
    mobileLogin,
    logout,
  } = useAuthStore()

  function doLogout() {
    Modal.confirm({
      title: '确定要退出系统吗？',
      cancelText: '取消',
      okText: '确认',
      async onOk() {
        logout()
        await to('/login', true)
      },
    })
  }

  function getToken() {
    return accessToken.value
  }

  return {
    isAuthenticated,
    loading,
    userInfo,
    accountLogin,
    mobileLogin,
    doLogout,
    getToken,
  }
}
