import type { EditorAction } from './types'

/** 图片与附件面板中的操作项。 */
export const attachmentActions: EditorAction[] = [
  {
    key: 'image',
    label: '图片',
    description: '本地相册',
    icon: 'i-lucide:image',
    iconClass: 'primary-tinted',
  },
  {
    key: 'file',
    label: '文件',
    description: '文档附件',
    icon: 'i-lucide:file-up',
    iconClass: 'bg-info-tint text-info',
  },
]

/** 更多发送方式面板中的快捷操作项。 */
export const extensionActions: EditorAction[] = [
  {
    key: 'location',
    label: '位置',
    description: '发送定位',
    icon: 'i-lucide:map-pin',
    iconClass: 'bg-success-tint text-success',
    preset: '[位置] 公司总部 18F 会议室',
  },
  {
    key: 'card',
    label: '名片',
    description: '联系人卡片',
    icon: 'i-lucide:contact',
    iconClass: 'primary-tinted',
    preset: '[名片] 产品经理 王五',
  },
  {
    key: 'code',
    label: '代码',
    description: '代码片段',
    icon: 'i-lucide:code-2',
    iconClass: 'bg-warning-tint text-warning',
    preset: '```ts\nconst message = "hello"\n```',
  },
  {
    key: 'todo',
    label: '待办',
    description: '快速任务',
    icon: 'i-lucide:list-checks',
    iconClass: 'bg-info-tint text-info',
    preset: '[待办] 请在今天 18:00 前确认评审结论',
  },
]
