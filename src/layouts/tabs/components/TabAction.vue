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

import type { TabActionEmits, TabActionKey } from './types'

const emits = defineEmits<TabActionEmits>()

const options: any[] = [
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
]

const handleSelect = ({ key }: { key: string }) => {
  emits(key as TabActionKey)
}
</script>
