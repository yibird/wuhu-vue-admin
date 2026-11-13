import { getCurrentInstance, onScopeDispose } from 'vue'
import { useRoute } from 'vue-router'
import { tabsStore } from '@/store/tabs/store'
import { registerTabCloseGuard } from '@/store/tabs/guard'
import { toRouteTabKey } from '@/store/tabs/util'
import type { TabCloseGuard } from '@/store/tabs/types'

/**
 * 解析当前组件所属 Tab 的 key
 *
 * 组件首次挂载时同步取值:此时 history.state 与 RouterView 提供的 route
 * 都对应正在打开的 Tab。捕获的是普通字符串,后续 KeepAlive 缓存与全局路由变化
 * 都不会让它漂移。
 *
 * 候选值按 history.state、菜单 id、路由 Tab key 依次尝试,优先选当前已打开
 * Tab 中真实存在的 key;直接访问尚未建立 Tab 的页面时,退回路由 Tab key。
 */
function resolveTabKey() {
  const route = useRoute()
  const routeKey = toRouteTabKey(route.path, route.query)
  const keys = [
    history.state?.tabKey as string | undefined,
    route.meta.id ? String(route.meta.id) : undefined,
    routeKey,
  ]
  const { tabs } = tabsStore()
  return (
    keys.find((key) => key && tabs.some((tab) => tab.key === key)) ?? routeKey
  )
}

/**
 * 注册当前 Tab 的关闭前守卫
 *
 * 在路由组件的 setup 中调用,关闭该组件对应的 Tab 前执行守卫:
 * 返回 false 保留 Tab,返回 true 允许关闭,返回 Promise<boolean> 可等待确认弹窗。
 * 守卫随组件作用域销毁自动注销,页面无需关心清理时机。
 *
 * @param guard 关闭守卫
 */
export function onBeforeTabLeave(guard: TabCloseGuard) {
  if (!getCurrentInstance()) {
    console.warn('[tabs] onBeforeTabLeave() 必须在组件 setup 中调用')
    return
  }

  const dispose = registerTabCloseGuard(resolveTabKey(), guard)
  onScopeDispose(dispose)
}
