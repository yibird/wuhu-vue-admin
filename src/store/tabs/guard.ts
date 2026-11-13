import type {
  ITab,
  TabCloseContext,
  TabCloseGuard,
  TabCloseSource,
} from './types'

/**
 * 关闭守卫注册表,按 Tab key 分组
 *
 * 守卫由页面组件通过 onBeforeTabLeave() 就近注册,随组件作用域销毁自动注销。
 * 被 KeepAlive 缓存的组件不会销毁,因此非激活 Tab 在批量关闭时仍能参与判定。
 */
const closeGuards = new Map<string, Set<TabCloseGuard>>()

/**
 * 登记指定 Tab 的关闭守卫
 *
 * @param key Tab key
 * @param guard 关闭守卫
 * @returns 注销函数
 */
export function registerTabCloseGuard(key: string, guard: TabCloseGuard) {
  const guards = closeGuards.get(key) ?? new Set<TabCloseGuard>()
  guards.add(guard)
  closeGuards.set(key, guards)

  return () => {
    guards.delete(guard)
    if (guards.size === 0) closeGuards.delete(key)
  }
}

/**
 * 判定 Tab 是否允许关闭
 *
 * 同一 Tab 的守卫全部通过才放行;守卫抛错时按放行处理并输出警告,
 * 避免页面异常导致 Tab 永远无法关闭
 *
 * @param tab 将被关闭的 Tab
 * @param source 关闭来源
 * @returns 是否放行
 */
export async function canCloseTab(
  tab: ITab,
  source: TabCloseSource = 'single'
) {
  const guards = closeGuards.get(tab.key)
  if (!guards?.size) return true

  const context: TabCloseContext = { tab, source }
  for (const guard of guards) {
    try {
      if ((await guard(context)) === false) return false
    } catch (error) {
      console.warn('[tabs] Tab 关闭守卫执行失败,已按放行处理', error)
    }
  }

  return true
}
