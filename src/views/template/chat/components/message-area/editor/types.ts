import type { ChatSettings, Message } from '../../types'

export interface EditorProps {
  placeholder?: string
  disabled?: boolean
  replyMessage?: Message | null
  editMessage?: Message | null
  settings?: ChatSettings
}

/** 编辑器工具面板中的操作项。 */
export interface EditorAction {
  /**
   * @desc 操作唯一标识
   */
  key: string
  /**
   * @desc 操作名称
   */
  label: string
  /**
   * @desc 操作补充说明
   */
  description: string
  /**
   * @desc 图标名称
   */
  icon: string
  /**
   * @desc 图标容器样式类
   */
  iconClass: string
  /**
   * @desc 选中后填充到输入框的预设内容
   */
  preset?: string
}

export interface ImageAttachmentListProps {
  /**
   * @desc 待发送图片地址列表
   */
  images: string[]
  /**
   * @desc 还可继续添加的图片数量
   */
  remainingCount: number
}

export interface ComposeTipProps {
  /**
   * @desc 待编辑消息，为空表示非编辑态
   * @default null
   */
  editMessage?: Message | null
  /**
   * @desc 待回复消息，为空表示非回复态
   * @default null
   */
  replyMessage?: Message | null
}

export interface RecordingBarProps {
  /**
   * @desc 已录制时长，单位秒
   */
  duration: number
}

export interface AttachmentPanelProps {
  /**
   * @desc 可选的附件操作项
   */
  actions: EditorAction[]
  /**
   * @desc 还可继续添加的图片数量
   */
  remainingCount: number
}

export interface ExtensionPanelProps {
  /**
   * @desc 快捷发送方式列表
   */
  actions: EditorAction[]
}

export interface EditorToolbarProps {
  /**
   * @desc 是否处于录音状态
   */
  recording: boolean
  /**
   * @desc 工具栏操作反馈文案，为空时隐藏
   * @default ''
   */
  feedback?: string
  /**
   * @desc 还可继续添加的图片数量
   */
  remainingCount: number
}
