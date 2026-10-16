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

/**
 * 事件名必须写成字面量：defineEmits 的类型参数由 SFC 编译器静态提取，
 * `typeof EmitEvent.XXX` 这类成员访问取不到名字，会静默生成不出运行时 emits
 * （监听器退化成 attrs，根节点是片段时还会触发 Vue 警告）。
 * 事件名与 EmitEvent 的一致性由 emit 调用处（emits(EmitEvent.XXX)）做类型校验。
 */
export interface TabItemEmits {
  (e: 'change', tab: ITab, index: number): void
  (e: 'close', tab: ITab, index: number): void
  (e: 'refresh'): void
  (e: 'closeCurrent'): void
  (e: 'closeLeft'): void
  (e: 'closeRight'): void
  (e: 'closeOther'): void
  (e: 'closeAll'): void
  (e: 'collect', index: number): void
  (e: 'togglePin', tab: ITab, pin: boolean): void
}

export interface TabListEmits extends TabItemEmits {
  (e: 'dragEnd', tab: ITab): void
}

export interface TabItemProps {
  index?: number
  active?: boolean
  item: ITab
  showIcon?: boolean
}
