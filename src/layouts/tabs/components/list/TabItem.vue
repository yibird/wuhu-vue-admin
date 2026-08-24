<template>
  <a-dropdown
    :trigger="['contextmenu']"
    :menu="{ items: getOptions(item) }"
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
      @keydown.enter.prevent="onClick"
      @keydown.space.prevent="onClick"
    >
      <span class="tab-item__icon" v-if="showTabIcon">
        <Icon v-if="item.icon" :name="item.icon" :size="16" />
      </span>
      <span class="tab-item__title">{{ item?.title }}</span>
      <TabPin :fixed="item.fixed" @toggle="onTogglePin" />
      <TabClose :fixed="item.fixed" @close="onClose" />
    </div>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { EmitEvent } from '../constant'
import { getOptions } from './options'
import TabPin from './TabPin.vue'
import TabClose from './TabClose.vue'
import type { TabItemEmits, TabItemProps } from '../types'

const {
  index = 0,
  active = false,
  item,
  showIcon = false,
} = defineProps<TabItemProps>()
const emits = defineEmits<TabItemEmits>()

const showTabIcon = computed(() => showIcon && item.icon)

const onClick = () => {
  emits(EmitEvent.CHANGE, item, index)
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
