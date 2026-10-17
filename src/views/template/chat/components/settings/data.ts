import type { ChatSettings } from '../types'

export type BinarySettingKey = keyof Pick<
  ChatSettings,
  | 'enterToSend'
  | 'desktopNotify'
  | 'messageSound'
  | 'readReceipt'
  | 'dnd'
  | 'compactMode'
  | 'showAvatar'
  | 'showTimestamp'
>

export interface BinarySetting {
  /**
   * @desc 对应的设置字段
   */
  key: BinarySettingKey
  /**
   * @desc 设置项名称
   */
  label: string
  /**
   * @desc 设置项说明
   */
  description: string
  /**
   * @desc 图标类名
   */
  icon: string
  /**
   * @desc 图标容器样式
   */
  iconClass: string
}

export interface SettingSection {
  /**
   * @desc 分类标识
   */
  key: string
  /**
   * @desc 分类名称
   */
  title: string
  /**
   * @desc 分类下的开关项
   */
  items: BinarySetting[]
}

/**
 * 设置面板的开关项配置
 */
export const settingSections: readonly SettingSection[] = [
  {
    key: 'notify',
    title: '消息通知',
    items: [
      {
        key: 'desktopNotify',
        label: '桌面通知',
        description: '窗口不在前台时提醒新消息',
        icon: 'i-lucide:monitor-dot',
        iconClass: 'bg-info-tint text-info',
      },
      {
        key: 'messageSound',
        label: '消息提示音',
        description: '收到新消息时播放提示音',
        icon: 'i-lucide:volume-2',
        iconClass: 'primary-tinted',
      },
      {
        key: 'dnd',
        label: '全局免打扰',
        description: '暂停所有提醒与自动回复',
        icon: 'i-lucide:moon',
        iconClass: 'bg-warning-tint text-warning',
      },
    ],
  },
  {
    key: 'display',
    title: '消息显示',
    items: [
      {
        key: 'compactMode',
        label: '紧凑消息流',
        description: '压缩消息间距,同屏显示更多内容',
        icon: 'i-lucide:rows-3',
        iconClass: 'bg-fill-quaternary text-secondary',
      },
      {
        key: 'showAvatar',
        label: '显示头像',
        description: '在消息旁显示发送者头像',
        icon: 'i-lucide:circle-user-round',
        iconClass: 'bg-success-tint text-success',
      },
      {
        key: 'showTimestamp',
        label: '显示消息时间',
        description: '在消息下方显示发送时间',
        icon: 'i-lucide:clock-3',
        iconClass: 'bg-fill-quaternary text-secondary',
      },
      {
        key: 'readReceipt',
        label: '已读回执',
        description: '向对方展示消息已读状态',
        icon: 'i-lucide:check-check',
        iconClass: 'bg-success-tint text-success',
      },
    ],
  },
  {
    key: 'input',
    title: '发送与输入',
    items: [
      {
        key: 'enterToSend',
        label: 'Enter 发送',
        description: 'Enter 直接发送,Shift + Enter 换行',
        icon: 'i-lucide:corner-down-left',
        iconClass: 'primary-tinted',
      },
    ],
  },
]
