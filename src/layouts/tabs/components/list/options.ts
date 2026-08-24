import { renderIcon } from '@/utils'
import { EmitEvent } from '../constant'
import type { ITab } from '#/config'

export const getOptions = (item: ITab) => {
  return [
    {
      key: EmitEvent.REFRESH,
      label: '刷新当前',
      icon: renderIcon('i-lucide:rotate-cw'),
    },
    {
      key: EmitEvent.CLOSE_CURRENT,
      label: '关闭当前标签',
      icon: renderIcon('i-lucide:x'),
      disabled: item.fixed,
    },
    {
      key: EmitEvent.CLOSE_LEFT,
      label: '关闭左侧标签',
      icon: renderIcon('i-lucide:arrow-left-to-line'),
    },
    {
      key: EmitEvent.CLOSE_RIGHT,
      label: '关闭右侧标签',
      icon: renderIcon('i-lucide:arrow-right-to-line'),
    },
    {
      key: EmitEvent.CLOSE_OTHER,
      label: '关闭其他标签',
      icon: renderIcon('i-lucide:circle-x'),
    },
    {
      key: EmitEvent.CLOSE_ALL,
      label: '关闭全部标签',
      icon: renderIcon('i-lucide:square-x'),
    },
    {
      type: 'divider',
    },
    {
      key: EmitEvent.COLLECT,
      label: '收藏',
      icon: renderIcon('i-lucide:star'),
    },
    {
      key: EmitEvent.TOGGLE_PIN,
      label: item.fixed ? '取消固定' : '固定',
      icon: renderIcon(item.fixed ? 'i-lucide:pin-off' : 'i-lucide:pin'),
    },
  ]
}
