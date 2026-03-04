import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { permissionStore } from '@/store'

import type { Component } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

const componentModules = import.meta.glob(
  [
    '/src/views/**/*.vue',
    '/src/views/**/*.tsx',
    '!/src/views/**/components/**/*.vue',
    '!/src/views/**/components/**/*.tsx',
  ],
  { eager: false }
) as Record<string, () => Promise<Component>>

const resolveComponentPath = (menuPath: string) => {
  const base = '/src/views'
  const normalized = menuPath.startsWith('/') ? menuPath : `/${menuPath}`
  const candidates = [
    `${base}${normalized}/index.vue`,
    `${base}${normalized}/index.tsx`,
    `${base}${normalized}/entry/index.vue`,
    `${base}${normalized}/entry/index.tsx`,
  ]
  return candidates
}

const getComponentName = (path: string, separator: string = '-') => {
  return path
    .split('/')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(separator)
}

const isRegister = ref(false)

export function useRegisterRoutes(router: Router) {
  const { flatMenus } = storeToRefs(permissionStore())

  const registerRoutes = async (parentName = 'index') => {
    const menus = flatMenus.value.filter(
      (item) => [1, 2].includes(item.type) && item.path
    )

    for (const menu of menus) {
      const candidates = resolveComponentPath(menu.path!)
      const matched = candidates.find((path) => componentModules[path])
      if (!matched || !menu.path) continue
      const componentName = getComponentName(menu.path)
      const route = {
        path: menu.path.replace(/^\//, '') || '',
        component: async () => {
          const module = await (componentModules[matched] as Function)()
          const comp = module.default || module
          comp.name = componentName
          return comp
        },
        meta: {
          id: menu.id,
          componentName,
          title: menu.title,
        },
      }
      router.addRoute(parentName, route as RouteRecordRaw)
    }
    isRegister.value = true
  }
  return {
    isRegister,
    registerRoutes,
  }
}
