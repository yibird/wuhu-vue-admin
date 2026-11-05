import { treeToList } from '@zhouchengfeng/okay'
import { menus } from '@/config'
import { isMenu } from '../utils/menu'
import { normalizePath } from '../utils/path'
import { prefetchRouteView } from '../utils/route'

/**
 * 路由预取的触发方式
 */
export type RoutePrefetchTrigger = 'hover' | 'focus' | 'touch'

/**
 * 预取目标
 *
 * 字符串视为路由 path,对象可通过 path 或菜单 id 指定目标。
 */
export type RoutePrefetchTarget =
  | string
  | {
      /**
       * @desc 路由 path
       */
      path?: string
      /**
       * @desc 菜单 id
       */
      menuId?: string
    }

/**
 * 可直接绑定的预取事件处理器
 */
export interface RoutePrefetchHandlers {
  onMouseover?: () => void
  onFocusin?: () => void
  onTouchstart?: () => void
}

export interface UseRoutePrefetchOptions {
  /**
   * @desc 默认触发方式
   * @default ['hover', 'focus', 'touch']
   */
  triggers?: RoutePrefetchTrigger[]
}

const DEFAULT_TRIGGERS: RoutePrefetchTrigger[] = ['hover', 'focus', 'touch']

const TRIGGER_EVENT: Record<RoutePrefetchTrigger, keyof RoutePrefetchHandlers> =
  {
    hover: 'onMouseover',
    focus: 'onFocusin',
    touch: 'onTouchstart',
  }

/** 已预取的路径,避免重复触发动态导入 */
const prefetchedPaths = new Set<string>()

let menuPathMap: Map<string, string> | undefined

/**
 * 菜单 id 与路由 path 的映射
 *
 * 菜单数据在应用启动后不会变化,首次使用时构建一次即可。
 */
function getMenuPathMap() {
  if (!menuPathMap) {
    menuPathMap = new Map()
    for (const menu of treeToList(menus)) {
      if (!isMenu(menu)) continue
      menuPathMap.set(menu.id, normalizePath(menu.path))
    }
  }
  return menuPathMap
}

/**
 * 路由预取
 *
 * 预取只在首次触发时加载对应 chunk,失败时移除记录以便下次重试。
 */
export function useRoutePrefetch(options: UseRoutePrefetchOptions = {}) {
  const { triggers = DEFAULT_TRIGGERS } = options

  /**
   * 根据菜单 id 获取已注册的路由 path
   *
   * @param menuId 菜单 id
   */
  function getRoutePath(menuId: string) {
    return getMenuPathMap().get(menuId)
  }

  /**
   * 按路由 path 预取页面组件
   *
   * @param path 路由 path
   */
  function prefetchByPath(path: string) {
    const normalized = normalizePath(path)
    if (prefetchedPaths.has(normalized)) return

    prefetchedPaths.add(normalized)
    prefetchRouteView(normalized)?.catch(() => {
      prefetchedPaths.delete(normalized)
    })
  }

  /**
   * 按菜单 id 预取页面组件
   *
   * @param menuId 菜单 id
   */
  function prefetchByMenuId(menuId: string) {
    const path = getRoutePath(menuId)
    if (path) prefetchByPath(path)
  }

  /**
   * 预取目标路由组件
   *
   * @param target 路由 path 或预取目标
   */
  function prefetch(target: RoutePrefetchTarget) {
    if (typeof target === 'string') {
      prefetchByPath(target)
      return
    }
    if (target.path) {
      prefetchByPath(target.path)
      return
    }
    if (target.menuId) {
      prefetchByMenuId(target.menuId)
    }
  }

  /**
   * 创建可直接绑定到元素或组件上的预取事件
   *
   * 事件均使用冒泡事件,可绑定在列表容器上统一处理。
   *
   * @param target 预取目标
   * @param triggerList 触发方式,默认取选项中的配置
   */
  function createPrefetchHandlers(
    target: RoutePrefetchTarget,
    triggerList: RoutePrefetchTrigger[] = triggers
  ) {
    const handlers: RoutePrefetchHandlers = {}
    for (const trigger of triggerList) {
      handlers[TRIGGER_EVENT[trigger]] = () => prefetch(target)
    }
    return handlers
  }

  return {
    createPrefetchHandlers,
    getRoutePath,
    prefetch,
    prefetchByMenuId,
    prefetchByPath,
  }
}
