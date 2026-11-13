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
 * Tab 关闭来源,用于区分单个关闭与批量关闭
 */
export type TabCloseSource = 'single' | 'left' | 'right' | 'other' | 'all'

/**
 * Tab 关闭守卫上下文
 */
export interface TabCloseContext {
  /**
   * @desc 将被关闭的 Tab
   */
  tab: ITab
  /**
   * @desc 关闭来源,单个关闭固定为 single
   */
  source: TabCloseSource
}

/**
 * Tab 关闭守卫,返回 false 表示不允许关闭,支持异步判定
 */
export type TabCloseGuard = (
  context: TabCloseContext
) => boolean | Promise<boolean>
