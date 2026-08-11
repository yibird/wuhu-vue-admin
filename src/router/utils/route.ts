import { defineComponent, h } from 'vue'
import { isUrl } from '@/utils'
import { resolveMenuPermission } from '@/store/permission/access'
import { normalizeRoutePath, toChildRoutePath, toPascalCase } from './path'

import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { IMenu } from '#/config'

type RouteModule = { default: Component }
type RouteLoader<T = unknown> = () => Promise<T>

const routeComponentModules = import.meta.glob<RouteModule>(
  [
    '/src/views/**/index.vue',
    '/src/views/**/index.tsx',
    '!/src/views/**/components/**',
  ],
  { eager: false }
)

const componentShowcaseModules = import.meta.glob<RouteModule>(
  ['/src/views/components/*/index.vue', '/src/views/components/*/index.tsx'],
  { eager: false }
)

const componentModules = {
  ...routeComponentModules,
  ...componentShowcaseModules,
}

const VIEW_BASE = '/src/views'
const VIEW_FILE_SUFFIXES = [
  '/entry/index.vue',
  '/entry/index.tsx',
  '/index.vue',
  '/index.tsx',
] as const
const ROUTE_MENU_TYPES = [1, 2]

/**
 * 从视图文件路径提取路由路径
 * @param filePath - 视图文件路径（如 /src/views/user/list/index.vue）
 * @returns 路由路径（如 /user/list），如果不匹配返回 undefined
 */
function toRoutePathFromViewFile(filePath: string) {
  const normalized = filePath.replaceAll('\\', '/')
  for (const suffix of VIEW_FILE_SUFFIXES) {
    if (!normalized.endsWith(suffix)) continue
    const routePath = normalized.slice(VIEW_BASE.length, -suffix.length)
    return normalizeRoutePath(routePath)
  }
  return undefined
}

/**
 * 创建路由模块索引
 * @param modules - 路由模块数组（包含文件路径和加载器）
 * @returns 路由路径到加载器的映射
 */
function createRouteModuleIndex<T = unknown>(
  modules: Array<{ filePath: string; loader: RouteLoader<T> }>
): Map<string, RouteLoader<T>> {
  const index = new Map<string, RouteLoader<T>>()
  for (const { filePath, loader } of modules) {
    const routePath = toRoutePathFromViewFile(filePath)
    if (routePath && !index.has(routePath)) {
      index.set(routePath, loader)
    }
  }
  return index
}

/** 路由模块索引（路径 → 组件加载器） */
export const routeModuleIndex = createRouteModuleIndex<RouteModule>(
  Object.entries(componentModules).map(([filePath, loader]) => ({
    filePath,
    loader,
  }))
)

const routePrefetches = new Map<string, Promise<void>>()

interface NetworkInformationLike {
  effectiveType?: string
  saveData?: boolean
}

function canPrefetchRoute() {
  if (typeof navigator === 'undefined') return false
  const connection = (
    navigator as Navigator & { connection?: NetworkInformationLike }
  ).connection
  return !connection?.saveData && !connection?.effectiveType?.includes('2g')
}

export function prefetchRouteComponent(
  routePath?: string,
  componentPath = routePath
) {
  if (!routePath || !componentPath || isUrl(routePath) || !canPrefetchRoute()) {
    return
  }

  const normalizedPath = normalizeRoutePath(componentPath.split(/[?#]/, 1)[0]!)
  const loader = routeModuleIndex.get(normalizedPath)
  if (!loader) return

  const pending = routePrefetches.get(normalizedPath)
  if (pending) return pending

  const request = loader().then(
    () => undefined,
    () => {
      routePrefetches.delete(normalizedPath)
    }
  )
  routePrefetches.set(normalizedPath, request)
  return request
}

export function prefetchMenuRoute(menu: Pick<IMenu, 'componentPath' | 'path'>) {
  return prefetchRouteComponent(menu.path, menu.componentPath)
}

/**
 * 创建带名称的路由组件
 * @param loader - 组件加载器
 * @param name - 组件名称
 * @returns 带名称的 Vue 组件
 */
const createRouteComponent = (
  loader: RouteLoader<RouteModule>,
  name: string
) => {
  return loader().then(({ default: Component }) =>
    defineComponent({
      name,
      setup(_, { attrs, slots }) {
        return () => h(Component, attrs, slots)
      },
    })
  )
}

/**
 * 判断是否为路由菜单（非外链）
 * @param menu - 菜单项
 * @returns true 表示是路由菜单，false 表示是外链或无效菜单
 */
export function isMenu(menu: IMenu): boolean {
  if (menu.disabled || !ROUTE_MENU_TYPES.includes(menu.type) || !menu.path) {
    return false
  }
  return !isUrl(menu.path)
}

/**
 * 将菜单项转换为路由配置
 * @param menu - 菜单项
 * @returns 路由配置对象，如果菜单无效返回 null
 */
export const menuToRoute = (menu: IMenu): RouteRecordRaw | null => {
  if (!menu.path) return null
  const routePath = normalizeRoutePath(menu.path)
  const componentPath = normalizeRoutePath(menu.componentPath ?? routePath)
  const loader = routeModuleIndex.get(componentPath)
  if (!loader) {
    console.error(
      `[router] No view component found for menu "${menu.title}" (${componentPath}).`
    )
    return null
  }
  const componentName = toPascalCase(routePath)

  return {
    path: toChildRoutePath(routePath),
    name: componentName,
    component: () => createRouteComponent(loader, componentName),
    meta: {
      id: menu.id,
      title: menu.title,
      componentName,
      keepAlive: menu.keepAlive ?? true,
      permission: resolveMenuPermission(menu),
      hideInMenu: menu.type === 2,
      isExternal: menu.isExternal ?? false,
    },
  }
}
