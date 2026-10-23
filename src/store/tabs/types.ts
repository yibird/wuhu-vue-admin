import type { ITab } from '#/config'
import type { LocationQueryRaw } from 'vue-router'

export type { ITab }

/**
 * Tab 操作目标
 *
 * - string：Tab key
 * - number：Tab 下标
 * - ITab：Tab项，通过 Tab key 定位对应 Tab
 */
export type TabTarget = string | number | ITab

export interface TabNavOption {
  key: string
  path: string
  query?: LocationQueryRaw
}

export interface TabStoreState {
  /**
   * @desc 打开的标签页列表
   * @default []
   */
  tabs: ITab[]
  /**
   * @desc 当前选中的标签页id,undefined表示首页
   * @default undefined
   */
  activeKey?: string
  /**
   * @desc 刷新期间临时从 KeepAlive 缓存中排除的组件名
   * @default []
   */
  excludes: string[]
}

/**
 * Tab 生命周期动作
 */
export type TabGuardAction = 'open' | 'close'

/**
 * Tab 关闭来源,用于区分单个关闭与批量关闭
 */
export type TabGuardSource = 'single' | 'left' | 'right' | 'other' | 'all'

/**
 * Tab 守卫上下文
 */
export interface TabGuardContext {
  /**
   * @desc 目标 Tab,打开时为将要新增或激活的 Tab,关闭时为将被关闭的 Tab
   */
  tab: ITab
  /**
   * @desc 触发的生命周期动作
   */
  action: TabGuardAction
  /**
   * @desc 关闭来源,打开动作固定为 single
   */
  source: TabGuardSource
}

/**
 * Tab 守卫处理函数,返回 false 表示拦截
 */
export type TabGuardHandler = (
  context: TabGuardContext
) => boolean | Promise<boolean>

/**
 * Tab 生命周期守卫
 *
 * 打开守卫建议集中登记(页面挂载前无法参与判定),关闭守卫可在页面内就近声明
 */
export interface TabGuard {
  /**
   * @desc 打开前守卫,返回 false 时不新增也不激活该 Tab
   */
  beforeOpen?: TabGuardHandler
  /**
   * @desc 关闭前守卫,返回 false 时保留该 Tab
   */
  beforeClose?: TabGuardHandler
}
