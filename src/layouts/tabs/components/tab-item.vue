<template>
  <div
    :class="['tab-item', { 'tab-item-active': active }]"
    :index="index"
    @click="onClick"
    @contextmenu="onContextMenu"
  >
    <span class="tab-item__icon" v-if="showTabIcon">
      <Icon v-if="item.icon" :name="item.icon" :size="16" />
    </span>
    <span class="tab-item__title">{{ item?.title }}</span>
    <button
      class="tab-item__close"
      @click.prevent="emits(EmitEvent.CLOSE, item, index)"
    >
      <Icon name="i-lucide:x" :size="14" />
    </button>
    <n-dropdown
      trigger="manual"
      placement="bottom-start"
      :x="x"
      :y="y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @select="onSelect"
    />
  </div>
</template>
<script lang="ts" setup>
import { renderIcon } from '@/utils'
import { EmitEvent } from './constant'

import type { DropdownOption } from 'naive-ui'
import type { TabItemProps, TabItemEmits } from './types'

const {
  index = 0,
  active = false,
  item,
  showIcon = false,
} = defineProps<TabItemProps>()
const emits = defineEmits<TabItemEmits>()

const options: DropdownOption[] = [
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
  {
    type: 'divider',
  },
  {
    key: 'collect',
    label: '收藏',
    icon: renderIcon('i-lucide:star'),
  },
  {
    key: EmitEvent.TOGGLE_PIN,
    label: item?.fixed ? '取消固定' : '固定',
    icon: renderIcon('i-lucide:pin'),
  },
] as const

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)

const showTabIcon = computed(() => {
  return showIcon && item?.icon
})

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
}
const onClick = () => {
  emits(EmitEvent.CHANGE, item, index)
}
const onClickoutside = () => {
  showDropdown.value = false
}

const onSelect = (key: string) => {
  showDropdown.value = false
  switch (key) {
    case EmitEvent.REFRESH:
      emits(EmitEvent.REFRESH)
      break
    case EmitEvent.CLOSE_CURRENT:
      emits(EmitEvent.CLOSE_CURRENT)
      break
    case EmitEvent.CLOSE_LEFT:
      emits(EmitEvent.CLOSE_LEFT)
      break
    case EmitEvent.CLOSE_RIGHT:
      emits(EmitEvent.CLOSE_RIGHT)
      break
    case EmitEvent.CLOSE_OTHER:
      emits(EmitEvent.CLOSE_OTHER)
      break
    case EmitEvent.CLOSE_ALL:
      emits(EmitEvent.CLOSE_ALL)
      break
    case EmitEvent.COLLECT:
      emits(EmitEvent.COLLECT, index)
      break
    case EmitEvent.TOGGLE_PIN:
      emits(EmitEvent.TOGGLE_PIN, index, !item?.fixed)
      break
  }
}
</script>
