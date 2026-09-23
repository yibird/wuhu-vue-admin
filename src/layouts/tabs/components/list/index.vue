<template>
  <DragDropProvider @drag-end="handleDragEnd">
    <div class="layout-tabs-list__wrapper">
      <TransitionGroup name="layout-tabs">
        <DraggableItem
          v-for="(item, index) in items"
          :key="item.key"
          :disabled="{ draggable: !!item.pin }"
          :id="item.key"
          :index="index"
          accept="layout-tab"
          class="tab-item-wrapper"
          :data-tab-key="item.key"
          type="layout-tab"
        >
          <TabItem
            :index="index"
            :active="item.key === activeKey"
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
              (tab: ITab, fixed: boolean) => emit('togglePin', tab, fixed)
            "
          />
        </DraggableItem>
      </TransitionGroup>
    </div>
  </DragDropProvider>
</template>
<script lang="ts" setup>
import { DragDropProvider } from '@dnd-kit/vue'
import { arrayMove } from '@dnd-kit/helpers'
import { isSortable } from '@dnd-kit/vue/sortable'
import { DraggableItem } from '@/components'
import TabItem from './TabItem.vue'

import type { TabListProps } from '../types'
import type { DragEndEvent } from '@dnd-kit/vue'
import type { ITab } from '#/config'

const { activeKey, showIcon } = defineProps<TabListProps>()

const emit = defineEmits<{
  change: [tab: ITab, index: number]
  close: [tab: ITab, index: number]
  refresh: []
  closeCurrent: []
  closeLeft: []
  closeRight: []
  closeOther: []
  closeAll: []
  collect: [index: number]
  togglePin: [tab: ITab, fixed: boolean]
  dragEnd: [tab: ITab]
}>()

const items = defineModel<ITab[]>('items')

function handleDragEnd(e: DragEndEvent) {
  const currentItems = items.value ?? []
  const source = e.operation.source
  if (e.canceled || !source || !isSortable(source)) return
  const nextItems = arrayMove(currentItems, source.initialIndex, source.index)
  if (nextItems === currentItems) return
  items.value = nextItems
  const sourceId = e.operation.source?.id
  const tab = nextItems.find((item) => item.key === sourceId)
  if (tab) emit('dragEnd', tab)
}
</script>
