<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <button class="tab-control tab-control-action">
      <Icon name="i-lucide:chevron-down" :size="20" />
    </button>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { renderIcon } from '@/utils'
import { EmitEvent } from './constant'

import type { MenuOption } from 'naive-ui'
import type { TabActionEmits, TabActionKey } from './types'

const emits = defineEmits<TabActionEmits>()

const options: MenuOption[] = [
  {
    key: EmitEvent.REFRESH,
    title: '刷新当前',
    icon: renderIcon('i-lucide:rotate-cw'),
  },
  {
    key: EmitEvent.CLOSE_CURRENT,
    title: '关闭当前标签页',
    icon: renderIcon('i-lucide:x'),
  },
  {
    key: EmitEvent.CLOSE_LEFT,
    title: '关闭左侧标签页',
    icon: renderIcon('i-lucide:arrow-left-to-line'),
  },
  {
    key: EmitEvent.CLOSE_RIGHT,
    title: '关闭右侧标签页',
    icon: renderIcon('i-lucide:arrow-right-to-line'),
  },
  {
    key: EmitEvent.CLOSE_OTHER,
    title: '关闭其他标签页',
    icon: renderIcon('i-lucide:circle-x'),
  },
  {
    key: EmitEvent.CLOSE_ALL,
    title: '关闭全部标签页',
    icon: renderIcon('i-lucide:square-x'),
  },
]

const handleSelect = (key: string) => {
  emits(key as TabActionKey)
}
</script>
