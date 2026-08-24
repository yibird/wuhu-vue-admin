import { defineComponent, h } from 'vue'
import { isUrl } from '@/utils'
import { normalizePath } from './path'

import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { IMenu } from '#/config'

type RouteModule = { default: Component }
type RouteLoader<T = unknown> = () => Promise<T>

const routeModules = import.meta.glob<RouteModule>(
  [
    '/src/views/**/index.vue',
    '/src/views/**/index.tsx',
    '!/src/views/**/components/**',
  ],
  { eager: false }
)

const VIEW_BASE = '/src/views'
const VIEW_FILE_SUFFIXES = [
  '/entry/index.vue',
  '/entry/index.tsx',
  '/index/index.vue',
  '/index/index.tsx',
  '/index.vue',
  '/index.tsx',
] as const
const ROUTE_MENU_TYPES = [1, 2]

/**
 * 从视图文件路径提取路由路径
 *
 * @param filePath - 视图文件路径（如 /src/views/user/list/index.vue）
 * @returns 路由路径（如 /user/list），如果不匹配返回 undefined
 */
function toRoutePathFromViewFile(filePath: string) {
  const normalized = filePath.replaceAll('\\', '/')
  for (const suffix of VIEW_FILE_SUFFIXES) {
    if (!normalized.endsWith(suffix)) continue
    const routePath = normalized.slice(VIEW_BASE.length, -suffix.length)
    return normalizePath(routePath)
  }
  return undefined
}

/**
 *  根据 路由模块创建模块缓存,用于优化路由查找速度
 *
 * @returns 路由模块缓存
 */
function createRouteModuleCache() {
  const cache = new Map<string, RouteLoader<RouteModule>>()
  for (const [filePath, loader] of Object.entries(routeModules)) {
    const routePath = toRoutePathFromViewFile(filePath)
    if (!routePath) continue
    if (cache.has(routePath)) {
      console.warn(`[router] Duplicate route component: ${routePath}`)
      continue
    }
    cache.set(routePath, loader)
  }
  return cache
}

const moduleCache = createRouteModuleCache()

/**
 * 创建带名称的路由组件
 *
 * @param loader - 组件加载器
 * @param name - 组件名称
 * @returns 带名称的 Vue 组件
 */
const createRouteComponent = (
  loader: RouteLoader<RouteModule>,
  name: string
) => {
  const AsyncComponent = defineAsyncComponent(loader)
  return defineComponent({
    name,
    setup(_, { attrs, slots }) {
      return () => h(AsyncComponent, attrs, slots)
    },
  })
}

/**
 * 判断是否为路由菜单（非外链）
 *
 * @param menu - 菜单项
 * @returns true 表示是路由菜单，false 表示是外链或无效菜单
 */
export function isMenu(menu: IMenu): menu is RequiredKeys<IMenu, 'path'> {
  return (
    ROUTE_MENU_TYPES.includes(menu.type) && !!menu.path && !isUrl(menu.path)
  )
}

/**
 * 根据菜单path获取组件名
 *
 * @param path 菜单path
 * @returns 组件名
 */
export function getComponentName(path: string) {
  return path
    .split(/[/-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * 获取路由元信息
 *
 * @param menu  菜单项
 * @returns 路由元信息
 */
function getRouteMeta(menu: IMenu) {
  return {
    id: menu.id,
    title: menu.title,
    keepAlive: menu.keepAlive ?? true,
    permission: menu.permission,
    hideInMenu: menu.type === 2,
    isExternal: menu.isExternal ?? false,
  }
}

/**
 * 将菜单项转换为路由配置
 *
 * @param menu - 菜单项
 * @returns 路由配置对象，如果菜单无效返回 null
 */
export const menuToRoute = (
  menu: RequiredKeys<IMenu, 'path'>
): RouteRecordRaw | null => {
  // 1.获取组件path
  const routePath = normalizePath(menu.path)
  // 2.根据组件path 获取对应组件
  const loader = moduleCache.get(routePath)
  if (!loader) {
    console.error(
      `[router] No view component found for menu "${menu.title}" (${routePath}).`
    )
    return null
  }
  // 3.获取组件名,组件名用于Keepalive缓存控制
  const componentName = getComponentName(menu.path)
  // 4. 根据loader和组件名创建route 组件
  const component = createRouteComponent(loader, componentName)

  return {
    path: menu.path,
    name: componentName,
    component,
    meta: getRouteMeta(menu),
  }
}
