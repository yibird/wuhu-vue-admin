import { EmitEvent } from './constant'
import type { ITab } from '#/config'

export type EmitEventType = (typeof EmitEvent)[keyof typeof EmitEvent]

export interface TabControlProps {}

export type TabControlEmit = (e: 'click') => void

export interface TabHomeProps extends TabControlProps {
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
  items?: ITab[]
  current: number
  showIcon?: boolean
}

export interface TabItemEmits {
  (e: typeof EmitEvent.CHANGE, menu: ITab, index: number): void
  (e: typeof EmitEvent.CLOSE, menu: ITab, index: number): void
  (e: typeof EmitEvent.REFRESH): void
  (e: typeof EmitEvent.CLOSE_CURRENT): void
  (e: typeof EmitEvent.CLOSE_LEFT): void
  (e: typeof EmitEvent.CLOSE_RIGHT): void
  (e: typeof EmitEvent.CLOSE_OTHER): void
  (e: typeof EmitEvent.CLOSE_ALL): void
  (e: typeof EmitEvent.COLLECT, index: number): void
  (e: typeof EmitEvent.TOGGLE_PIN, index: number, fixed: boolean): void
}

export interface TabListEmits extends TabItemEmits {
  (e: typeof EmitEvent.DRAG_END, index: number): void
}

export interface TabItemProps {
  index?: number
  active?: boolean
  item: ITab
  showIcon?: boolean
}
