import { treeToList } from '@zhouchengfeng/okay'
import { menus } from '@/config'
import { isMenu, menuToRoute } from '../utils'
import type { Router } from 'vue-router'

const isRegistered = ref(false)

export function useRegisterRoutes(router: Router) {
  const registerRoutes = () => {
    if (isRegistered.value) return
    for (const menu of treeToList(menus)) {
      if (!isMenu(menu)) continue
      const route = menuToRoute(menu)
      if (!route || typeof route.name !== 'string') {
        continue
      }
      router.addRoute('index', route)
    }
    isRegistered.value = true
  }
  return {
    isRegistered,
    registerRoutes,
  }
}
