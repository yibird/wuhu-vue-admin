import { treeToList } from '@zhouchengfeng/okay/coll'
import { menus } from '@/config'
import { isMenu, menuToRoute } from '../utils'

import type { Router } from 'vue-router'

const ROUTE_PARENT_NAME = 'index'

interface RouteRegistryState {
  registered: boolean
  routeNames: Set<string>
}

const registries = new WeakMap<Router, RouteRegistryState>()

function getRegistry(router: Router): RouteRegistryState {
  const existing = registries.get(router)
  if (existing) return existing

  const state: RouteRegistryState = {
    registered: false,
    routeNames: new Set(),
  }
  registries.set(router, state)
  return state
}

export function useRegisterRoutes(router: Router) {
  const registry = getRegistry(router)
  const registerRoutes = (parentName = ROUTE_PARENT_NAME) => {
    if (registry.registered) return

    const flatMenus = treeToList(menus)
    for (const menu of flatMenus) {
      if (!isMenu(menu)) continue
      const route = menuToRoute(menu)
      if (!route) continue
      if (typeof route.name === 'string' && router.hasRoute(route.name)) {
        router.removeRoute(route.name)
      }
      router.addRoute(parentName, route)
      if (typeof route.name === 'string') registry.routeNames.add(route.name)
    }
    registry.registered = true
  }

  const unregisterRoutes = () => {
    for (const routeName of registry.routeNames) {
      if (router.hasRoute(routeName)) router.removeRoute(routeName)
    }
    registry.routeNames.clear()
    registry.registered = false
  }

  return {
    get isRegistered() {
      return registry.registered
    },
    registerRoutes,
    unregisterRoutes,
  }
}
