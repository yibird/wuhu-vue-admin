import { authStore, permissionStore } from '@/store'
import { menus } from '@/config'
import { usePermission } from '@/hooks/usePermission'
import { getToken } from '@/utils'
import { getSafeRedirect, prefetchRouteView } from '../utils'

import type { RouteLocationNormalized, Router } from 'vue-router'
import type { IRouteMeta } from '../types'

/**
 * 提前触发目标路由的懒加载组件
 *
 * 会话恢复需要一次网络往返,而路由组件 chunk 要等守卫放行后才会开始加载。
 * 在等待会话期间并行触发组件加载,把「会话 → 路由 chunk」的串行瀑布改成并行。
 * 动态 import 会被浏览器缓存,路由后续解析时不会重复请求。
 *
 * @param to 目标路由
 */
function prefetchRouteComponents(to: RouteLocationNormalized) {
  for (const record of to.matched) {
    for (const component of Object.values(record.components ?? {})) {
      if (typeof component !== 'function') continue
      try {
        const result = (component as () => unknown)()
        // 仅预取返回 Promise 的懒加载组件;函数式组件不参与预取
        if (result instanceof Promise) {
          void result.catch(() => undefined)
        }
      } catch {
        // 组件不是懒加载函数时忽略,交给路由正常解析
      }
    }
  }
}

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
      // 会话恢复与路由组件加载并行,避免两者串行等待
      prefetchRouteComponents(to)
      void prefetchRouteView(to.path)?.catch(() => undefined)
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
