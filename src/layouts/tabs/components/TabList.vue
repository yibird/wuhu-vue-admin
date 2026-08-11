<template>
  <DragDropProvider @drag-end="handleDragEnd">
    <div class="layout-tabs-list__wrapper">
      <TransitionGroup name="layout-tabs">
        <DndSortableItem
          v-for="(item, index) in items"
          :key="item.name"
          :disabled="{ draggable: !!item.fixed }"
          :id="item.name"
          :index="index"
          accept="layout-tab"
          class="tab-item-wrapper"
          :data-tab-key="item.name"
          type="layout-tab"
        >
          <TabItem
            :index="index"
            :active="current === index"
            :item="item"
            :showIcon="showIcon"
            @change="(tab: ITab, idx: number) => emit('change', tab, idx)"
            @close="(tab: ITab, idx: number) => emit('close', tab, idx)"
            @refresh="emit('refresh')"
            @close-current="emit('closeCurrent')"
            @close-left="emit('closeLeft')"
            @close-right="emit('closeRight')"
            @close-other="emit('closeOther')"
            @close-all="emit('closeAll')"
            @collect="(idx: number) => emit('collect', idx)"
            @toggle-pin="
              (idx: number, fixed: boolean) => emit('togglePin', idx, fixed)
            "
          />
        </DndSortableItem>
      </TransitionGroup>
    </div>
  </DragDropProvider>
</template>
<script lang="ts" setup>
import { DragDropProvider } from '@dnd-kit/vue'
import { arrayMove } from '@dnd-kit/helpers'
import { isSortable } from '@dnd-kit/vue/sortable'
import DndSortableItem from '@/components/dndSortableItem/index.vue'
import TabItem from './TabItem.vue'

import type { TabListProps } from './types'
import type { DragEndEvent } from '@dnd-kit/vue'
import type { ITab } from '#/config'

const { current, showIcon } = defineProps<TabListProps>()

const emit = defineEmits<{
  change: [menu: ITab, index: number]
  close: [menu: ITab, index: number]
  refresh: []
  closeCurrent: []
  closeLeft: []
  closeRight: []
  closeOther: []
  closeAll: []
  collect: [index: number]
  togglePin: [index: number, fixed: boolean]
  dragEnd: [tab: ITab]
}>()

const items = defineModel<ITab[]>('items')

function handleDragEnd(event: DragEndEvent) {
  const currentItems = items.value ?? []
  const source = event.operation.source
  if (event.canceled || !source || !isSortable(source)) return

  const nextItems = arrayMove(currentItems, source.initialIndex, source.index)
  if (nextItems === currentItems) return

  items.value = nextItems
  const sourceId = event.operation.source?.id
  const tab = nextItems.find((item) => item.name === sourceId)
  if (tab) emit('dragEnd', tab)
}
</script>
