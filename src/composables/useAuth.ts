import { Modal } from 'antdv-next'
import { storeToRefs } from 'pinia'
import { useGo } from '@/router'
import { authStore } from '@/store'

import type { LoginRequest } from '@/apis'

export function useAuth() {
  const { to } = useGo()
  const store = authStore()
  const { loginLoading } = storeToRefs(store)

  const login = (credentials: LoginRequest) => store.login(credentials)

  const logout = () => {
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

  return {
    login,
    loginLoading,
    logout,
  }
}
