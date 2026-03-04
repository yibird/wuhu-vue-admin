import type { Events } from '@/constant'
import mitt from 'mitt'

type EventsType = {
  [Events.CHANGE_TOP_MENU_ID]: string
}

// 创建 emitter
export const emitter = mitt<EventsType>()
