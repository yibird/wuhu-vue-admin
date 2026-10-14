import { tryOnScopeDispose } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { registerTabGuard, tabsStore, toRouteTabKey } from '@/store'
import type { TabGuard } from '@/store'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

/**
 * 解析当前页面所属 Tab 的 key
 *
 * Tab key 并非路由 fullPath:菜单 Tab 用菜单 id(如 '13'),路由 Tab 用 path + 排序后的 query,
 * 直接取 fullPath 在带 query 的路由下与 Tab key、Tab path 都不匹配,守卫会静默失效。
 * 这里优先用当前激活 Tab 的 key,页面尚未对应 Tab 时退化为路由 Tab 的 key 规则。
 *
 * @param route 当前路由
 * @returns 当前页面所属 Tab 的 key
 */
function resolveCurrentTabKey(route: RouteLocationNormalizedLoaded) {
  const currentTab = tabsStore().currentTab
  // 激活 Tab 与当前路由同 path 时即当前页面所属 Tab(同 path 不同 query 也归属同一个 Tab)
  if (currentTab && currentTab.path === route.path) return currentTab.key

  // 页面尚未产生对应 Tab 时,按路由 Tab 的 key 规则登记,后续建立 Tab 后仍能命中
  return toRouteTabKey(route.path, route.query)
}

/**
 * Tab 生命周期守卫 Hooks
 *
 * 在页面内就近声明与当前页面绑定的守卫,组件卸载时自动注销;
 * 由于打开 Tab 时页面尚未挂载,打开守卫建议改用 registerTabGuard 集中登记。
 *
 * @param guard 守卫实现
 * @param key 匹配 key,默认取当前页面所属 Tab 的 key
 * @returns 注销函数
 */
export function useTabGuard(guard: TabGuard, key?: string) {
  const route = useRoute()
  // route 为全局响应式对象,这里快照当前页面的路由标识,避免守卫执行时读到其他页面
  const unregister = registerTabGuard(key ?? resolveCurrentTabKey(route), guard)
  tryOnScopeDispose(unregister)
  return unregister
}
