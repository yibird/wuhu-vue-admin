export interface MessageMiniMapItem {
  id: string | number

  /**
   * 消息类型
   */
  type?: 'user' | 'assistant' | 'tool'

  /**
   * 预览文本
   */
  preview?: string

  /**
   * 原始 DOM 元素
   */
  el?: HTMLElement
}

export interface MessageMiniMapOptions {
  /**
   * 基础宽度
   */
  width?: number

  /**
   * 最大扩展宽度
   */
  maxWidth?: number

  /**
   * 影响范围
   */
  radius?: number

  /**
   * 动画强度
   */
  stiffness?: number
}

export interface MessageMiniMapProps {
  messages: MessageMiniMapItem[]
  container: HTMLElement | null
}

export interface MessageMiniMapEmits {
  select: [item: MessageMiniMapItem]
}
