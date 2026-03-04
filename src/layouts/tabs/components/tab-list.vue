<template>
  <div ref="elRef" class="layout-tabs-list__wrapper">
    <TransitionGroup name="layout-tabs">
      <TabItem
        v-for="(item, index) in sortedItems"
        :key="item.name"
        :index="index"
        :active="current === index"
        :item="item"
        :showIcon="showIcon"
        :class="[!item.fixed ? 'tab-item-draggable' : 'tab-item-no-draggable']"
        @change="emits(EmitEvent.CHANGE, item, index)"
        @close="emits(EmitEvent.CLOSE, item, index)"
        @refresh="emits(EmitEvent.REFRESH)"
        @close-current="emits(EmitEvent.CLOSE_CURRENT)"
        @close-left="emits(EmitEvent.CLOSE_LEFT)"
        @close-right="emits(EmitEvent.CLOSE_RIGHT)"
        @close-other="emits(EmitEvent.CLOSE_OTHER)"
        @close-all="emits(EmitEvent.CLOSE_ALL)"
        @collect="emits(EmitEvent.COLLECT, index)"
        @toggle-pin="emits(EmitEvent.TOGGLE_PIN, index, item.fixed ?? false)"
      />
    </TransitionGroup>
  </div>
</template>
<script lang="ts" setup>
import { useDraggable } from 'vue-draggable-plus'
import TabItem from './tab-item.vue'
import { EmitEvent } from './constant'

import type { TabListProps, TabListEmits } from './types'
import type { ITab } from '#/config'

const { current, showIcon } = defineProps<TabListProps>()
const emits = defineEmits<TabListEmits>()

const items = defineModel<ITab[]>('items')
const elRef = ref<HTMLDivElement>()

const sortedItems = computed(() => {
  return (items.value ?? []).sort(
    (a, b) => (b.fixed ? 1 : 0) - (a.fixed ? 1 : 0)
  )
})

useDraggable(elRef, items, {
  direction: 'horizontal',
  animation: 150,
  draggable: '.tab-item-draggable',
  onEnd(e) {
    emits(EmitEvent.DRAG_END, e.newIndex!)
  },
})
</script>
