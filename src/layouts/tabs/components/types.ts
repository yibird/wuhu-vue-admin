import { EmitEvent } from './constant'
import type { ITab } from '#/config'

export type EmitEventType = (typeof EmitEvent)[keyof typeof EmitEvent]

export type TabControlEmits = (e: 'click') => void

export interface TabHomeProps {
  active?: boolean
}

export type TabActionKey =
  | 'refresh'
  | 'closeCurrent'
  | 'closeLeft'
  | 'closeRight'
  | 'closeOther'
  | 'closeAll'
export type TabActionEmits = (e: TabActionKey) => void

export interface TabListProps {
  /**
   * @desc tab列表
   * @default []
   */
  items?: ITab[]
  /**
   * @desc 激活tab的key
   * @default undefined
   */
  activeKey?: string
  /**
   * @desc 是否显示icon
   * @default true
   */
  showIcon?: boolean
}

export interface TabItemEmits {
  (e: typeof EmitEvent.CHANGE, tab: ITab, index: number): void
  (e: typeof EmitEvent.CLOSE, tab: ITab, index: number): void
  (e: typeof EmitEvent.REFRESH): void
  (e: typeof EmitEvent.CLOSE_CURRENT): void
  (e: typeof EmitEvent.CLOSE_LEFT): void
  (e: typeof EmitEvent.CLOSE_RIGHT): void
  (e: typeof EmitEvent.CLOSE_OTHER): void
  (e: typeof EmitEvent.CLOSE_ALL): void
  (e: typeof EmitEvent.COLLECT, index: number): void
  (e: typeof EmitEvent.TOGGLE_PIN, tab: ITab, pin: boolean): void
}

export interface TabListEmits extends TabItemEmits {
  (e: typeof EmitEvent.DRAG_END, tab: ITab): void
}

export interface TabItemProps {
  index?: number
  active?: boolean
  item: ITab
  showIcon?: boolean
}
