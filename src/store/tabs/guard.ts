import type {
  ITab,
  TabGuard,
  TabGuardAction,
  TabGuardContext,
  TabGuardHandler,
  TabGuardSource,
} from './types'

/**
 * 命中全部 Tab 的通用 key
 */
const GLOBAL_KEY = '*'

/**
 * 守卫注册表,key 为 Tab key、Tab path 或 '*'
 *
 * 同一 key 允许登记多个守卫,判定时全部通过才放行
 */
const guardRegistry = new Map<string, TabGuard[]>()

/**
 * 登记 Tab 生命周期守卫
 *
 * key 支持 Tab key(精确)、Tab path(精确)与 '*'(全局兜底);
 * 集中登记用于跨页面策略,页面内声明请使用 useTabGuard
 *
 * @param key 匹配 key
 * @param guard 守卫实现
 * @returns 注销函数
 */
export function registerTabGuard(key: string, guard: TabGuard): () => void {
  const guards = guardRegistry.get(key) ?? []
  guards.push(guard)
  guardRegistry.set(key, guards)

  return () => {
    const current = guardRegistry.get(key)
    const index = current?.indexOf(guard) ?? -1
    if (!current || index === -1) return
    current.splice(index, 1)
    if (current.length === 0) guardRegistry.delete(key)
  }
}

/**
 * 收集命中 Tab 的守卫,匹配顺序为 Tab key、Tab path、全局
 *
 * @param tab 目标 Tab
 * @param action 生命周期动作
 * @returns 待执行的守卫函数
 */
function resolveTabGuards(tab: ITab, action: TabGuardAction) {
  const field = action === 'open' ? 'beforeOpen' : 'beforeClose'
  const handlers: TabGuardHandler[] = []

  for (const key of [tab.key, tab.path, GLOBAL_KEY]) {
    for (const guard of guardRegistry.get(key) ?? []) {
      const handler = guard[field]
      if (handler) handlers.push(handler)
    }
  }

  return handlers
}

/**
 * 判定 Tab 是否允许执行生命周期动作
 *
 * 任一守卫返回 false 即拦截;守卫抛错时按放行处理并输出警告,
 * 避免页面异常导致 Tab 无法打开或无法关闭
 *
 * @param tab 目标 Tab
 * @param action 生命周期动作
 * @param source 关闭来源
 * @returns 是否放行
 */
async function runTabGuard(
  tab: ITab,
  action: TabGuardAction,
  source: TabGuardSource
) {
  const handlers = resolveTabGuards(tab, action)
  if (handlers.length === 0) return true

  const context: TabGuardContext = { tab, action, source }

  for (const handler of handlers) {
    try {
      if ((await handler(context)) === false) return false
    } catch (error) {
      console.warn('[tabs] Tab 守卫执行失败,已按放行处理', error)
    }
  }

  return true
}

/**
 * 判定 Tab 是否允许打开
 *
 * @param tab 将要新增或激活的 Tab
 * @returns 是否放行
 */
export function canOpenTab(tab: ITab) {
  return runTabGuard(tab, 'open', 'single')
}

/**
 * 判定 Tab 是否允许关闭
 *
 * @param tab 将被关闭的 Tab
 * @param source 关闭来源
 * @returns 是否放行
 */
export function canCloseTab(tab: ITab, source: TabGuardSource = 'single') {
  return runTabGuard(tab, 'close', source)
}
