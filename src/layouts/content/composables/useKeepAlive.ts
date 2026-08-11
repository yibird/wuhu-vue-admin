import { appStore, tabStore } from '@/store'
import { normalizeRoutePath, toPascalCase } from '@/router'
import { isUrl } from '@/utils'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export function getRouteViewKey(route: RouteLocationNormalizedLoaded) {
  const name = route.name ? String(route.name) : 'anonymous'
  return `${name}:${route.path}`
}

export function useKeepAlive() {
  const store = tabStore()
  const appConfig = appStore()
  const renderRouteView = computed(() => store.renderRouteView)
  const max = computed(() => {
    const value = Number(appConfig.app.pageCacheMax)
    return Number.isFinite(value) ? Math.min(20, Math.max(1, value)) : 10
  })
  const include = computed(() => {
    if (!appConfig.app.pageCache) return []

    const componentNames: string[] = []
    for (const tab of [store.homeTab, ...store.tabs]) {
      if (!tab?.keepAlive || !tab.path || isUrl(tab.path)) continue
      componentNames.push(toPascalCase(normalizeRoutePath(tab.path)))
    }
    return componentNames
  })

  return { renderRouteView, include, max }
}
