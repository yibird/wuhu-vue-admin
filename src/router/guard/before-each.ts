import { authStore, permissionStore } from '@/store'
import { menus } from '@/config'
import { usePermission } from '@/hooks/usePermission'
import { getToken } from '@/utils'
import { getSafeRedirect } from '../utils'

import type { Router } from 'vue-router'
import type { IRouteMeta } from '../types'

export function setupGlobalBeforeEachRouteGuard(router: Router) {
  const { hasPermission } = usePermission()

  return router.beforeEach(async (to) => {
    const auth = authStore()
    const permissions = permissionStore()
    const token = getToken()
    const isPublic = to.matched.some((record) => record.meta.public === true)

    if (isPublic) {
      if (to.path === '/login' && token) {
        return getSafeRedirect(to.query.redirect)
      }
      return true
    }

    if (!token) {
      auth.logout()
      return {
        path: '/login',
        query: to.fullPath === '/' ? undefined : { redirect: to.fullPath },
        replace: true,
      }
    }

    if (!auth.userInfo) {
      // 刷新页面后只有 token、没有用户信息,先恢复会话;
      // 直接跳登录会与「已登录访问 /login 跳回原路由」形成无限重定向。
      const restored = await auth.restoreSession()
      if (!restored) {
        return {
          path: '/login',
          query: to.fullPath === '/' ? undefined : { redirect: to.fullPath },
          replace: true,
        }
      }
    }

    if (permissions.menus.length === 0) {
      permissions.setMenus(menus)
    }

    const permission = to.meta.permission as IRouteMeta['permission']

    if (to.path === '/403') return true

    if (permission && !hasPermission(permission)) {
      return { path: '/403', replace: true }
    }

    return true
  })
}
