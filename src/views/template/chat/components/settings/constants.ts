import type { ChatSettings } from '../types'

/**
 * 聊天设置默认值
 *
 * 状态初始化、组件 props 兜底共用同一份,避免多处默认值漂移
 */
export function createDefaultChatSettings(): ChatSettings {
  return {
    enterToSend: true,
    desktopNotify: true,
    messageSound: true,
    soundVolume: 70,
    readReceipt: true,
    dnd: false,
    compactMode: false,
    showAvatar: true,
    showTimestamp: true,
    autoArchiveDays: 30,
  }
}
