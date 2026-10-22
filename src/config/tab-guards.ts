import { registerTabGuard } from '@/store/tabs/guard'

/**
 * 集中登记 Tab 生命周期守卫
 *
 * 这里只放跨页面策略(权限、模式开关、全局约束等)。
 */
export function setupTabGuards() {
  registerTabGuard('*', {
    beforeClose: ({ tab }) => !tab.pin,
  })
}
