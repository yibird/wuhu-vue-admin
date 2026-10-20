import { registerTabGuard } from '@/store/tabs/guard'

/**
 * 集中登记 Tab 生命周期守卫
 *
 * 这里只放跨页面策略(权限、模式开关、全局约束等),
 * 页面自身的状态判断(未保存、运行中等)请在页面内用 useTabGuard 就近声明。
 */
export function setupTabGuards() {
  registerTabGuard('*', {
    beforeClose: ({ tab }) => !tab.pin,
  })
}
