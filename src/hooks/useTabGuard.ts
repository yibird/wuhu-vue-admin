import { tryOnScopeDispose } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { registerTabGuard } from '@/store'
import type { TabGuard } from '@/store'

/**
 * Tab 生命周期守卫 Hooks
 *
 * 在页面内就近声明与当前页面绑定的守卫,组件卸载时自动注销;
 * 由于打开 Tab 时页面尚未挂载,打开守卫建议改用 registerTabGuard 集中登记。
 *
 * @param guard 守卫实现
 * @param key 匹配 key,默认取当前路由 fullPath(与路由 Tab 的 key 一致)
 * @returns 注销函数
 */
export function useTabGuard(guard: TabGuard, key?: string) {
  const route = useRoute()
  // route 为全局响应式对象,这里快照当前页面的路由标识,避免守卫执行时读到其他页面
  const unregister = registerTabGuard(key ?? route.fullPath, guard)
  tryOnScopeDispose(unregister)
  return unregister
}
