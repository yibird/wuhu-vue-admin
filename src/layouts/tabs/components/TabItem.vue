<template>
  <a-dropdown
    :trigger="['contextmenu']"
    :menu="{ items: options }"
    placement="bottomLeft"
    @menu-click="onSelect"
  >
    <div
      data-testid="tab-item"
      :class="[
        'tab-item',
        { 'tab-item-active': active, 'tab-item-fixed': item.fixed },
      ]"
      :aria-selected="active"
      :index="index"
      role="tab"
      tabindex="0"
      @click="onClick"
      @focusin="onPrefetch"
      @keydown.enter.prevent="onClick"
      @keydown.space.prevent="onClick"
      @pointerenter="onPrefetch"
    >
      <span class="tab-item__icon" v-if="showTabIcon">
        <Icon v-if="item.icon" :name="item.icon" :size="16" />
      </span>
      <span class="tab-item__title">{{ item?.title }}</span>
      <Icon
        v-if="item.fixed"
        name="i-lucide:pin"
        :size="16"
        class="tab-item__pin"
        @click.stop.prevent="onTogglePin"
      />
      <button
        class="tab-item__close"
        type="button"
        @click.stop.prevent="onClose"
      >
        <Icon name="i-lucide:x" :size="14" />
      </button>
    </div>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { renderIcon } from '@/utils'
import { prefetchMenuRoute } from '@/router'
import { EmitEvent } from './constant'

import type { TabItemEmits, TabItemProps } from './types'

const {
  index = 0,
  active = false,
  item,
  showIcon = false,
} = defineProps<TabItemProps>()

const emits = defineEmits<TabItemEmits>()

const showTabIcon = computed(() => showIcon && item.icon)

const options = computed(() => [
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
])

const onClick = () => {
  emits(EmitEvent.CHANGE, item, index)
}

const onPrefetch = () => {
  void prefetchMenuRoute(item)
}

const onTogglePin = () => {
  emits(EmitEvent.TOGGLE_PIN, index, !item.fixed)
}
const onClose = () => {
  if (item.fixed) return
  emits(EmitEvent.CLOSE, item, index)
}

const onSelect = ({ key }: { key: string }) => {
  switch (key) {
    case EmitEvent.REFRESH:
      emits(EmitEvent.REFRESH)
      break
    case EmitEvent.CLOSE_CURRENT:
      if (item.fixed) return

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
      emits(EmitEvent.TOGGLE_PIN, index, !item.fixed)
      break
  }
}
</script>
