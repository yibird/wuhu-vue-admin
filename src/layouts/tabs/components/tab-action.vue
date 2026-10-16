<template>
  <a-dropdown
    :trigger="['hover']"
    :menu="{ items: options }"
    @menu-click="handleSelect"
  >
    <button class="tab-control tab-control-action">
      <Icon name="i-lucide:chevron-down" :size="20" />
    </button>
  </a-dropdown>
</template>
<script lang="ts" setup>
import { renderIcon } from '@/utils'
import { EmitEvent } from './constant'
import type { MenuProps } from 'antdv-next'
import type { TabActionEmits, TabActionKey } from './types'

const emits = defineEmits<TabActionEmits>()

const options = [
  {
    key: EmitEvent.REFRESH,
    label: '刷新当前',
    icon: renderIcon('i-lucide:rotate-cw'),
  },
  {
    key: EmitEvent.CLOSE_CURRENT,
    label: '关闭当前标签页',
    icon: renderIcon('i-lucide:x'),
  },
  {
    key: EmitEvent.CLOSE_LEFT,
    label: '关闭左侧标签页',
    icon: renderIcon('i-lucide:arrow-left-to-line'),
  },
  {
    key: EmitEvent.CLOSE_RIGHT,
    label: '关闭右侧标签页',
    icon: renderIcon('i-lucide:arrow-right-to-line'),
  },
  {
    key: EmitEvent.CLOSE_OTHER,
    label: '关闭其他标签页',
    icon: renderIcon('i-lucide:circle-x'),
  },
  {
    key: EmitEvent.CLOSE_ALL,
    label: '关闭全部标签页',
    icon: renderIcon('i-lucide:square-x'),
  },
] satisfies NonNullable<MenuProps['items']>

const actionKeys: readonly TabActionKey[] = [
  EmitEvent.REFRESH,
  EmitEvent.CLOSE_CURRENT,
  EmitEvent.CLOSE_LEFT,
  EmitEvent.CLOSE_RIGHT,
  EmitEvent.CLOSE_OTHER,
  EmitEvent.CLOSE_ALL,
]

function isTabActionKey(value: unknown): value is TabActionKey {
  return actionKeys.some((key) => key === value)
}

const handleSelect: MenuProps['onClick'] = ({ key }) => {
  if (isTabActionKey(key)) emits(key)
}
</script>
