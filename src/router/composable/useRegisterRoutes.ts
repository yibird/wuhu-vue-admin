import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { permissionStore } from '@/store'

import type { Component } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'

export interface RegisterRoutesOptions {
  parentName?: string
}

interface ComponentModule {
  default: Component
}

const componentModules = import.meta.glob(
  [
    '/src/views/**/*.vue',
    '/src/views/**/*.tsx',
    '!/src/views/**/components/**/*.vue',
    '!/src/views/**/components/**/*.tsx',
  ],
  { eager: false }
) as Record<string, () => Promise<ComponentModule>>

const resolveComponentPath = (menuPath: string) => {
  const base = '/src/views'
  const normalized = menuPath.startsWith('/') ? menuPath : `/${menuPath}`
  return [
    `${base}${normalized}/index.vue`,
    `${base}${normalized}/index.tsx`,
    `${base}${normalized}/entry/index.vue`,
    `${base}${normalized}/entry/index.tsx`,
  ]
}

const getComponentName = (path: string, separator: string = '-') => {
  return path
    .split('/')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(separator)
}

const isRegister = ref(false)
let registering: Promise<void> | null = null

export function useRegisterRoutes(router: Router) {
  const store = permissionStore()
  const { flatMenus } = storeToRefs(store)

  const registerRoutes = async (options: RegisterRoutesOptions = {}) => {
    const { parentName = 'index' } = options

    if (isRegister.value) return
    if (registering) return registering

    registering = (async () => {
      try {
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
            component: defineAsyncComponent(async () => {
              const module = await componentModules[matched]()
              const comp: Component = module.default
              if (!comp.name) {
                ;(comp as Component & { name?: string }).name = componentName
              }
              return comp
            }),
            meta: {
              id: menu.id,
              componentName,
              title: menu.title,
            },
          }
          router.addRoute(parentName, route as RouteRecordRaw)
        }
        isRegister.value = true
      } finally {
        registering = null
      }
    })()

    return registering
  }

  return {
    isRegister,
    registerRoutes,
  }
}
