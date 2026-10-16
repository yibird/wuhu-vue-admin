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
            @change="(tab: ITab, idx: number) => emits('change', tab, idx)"
            @close="(tab: ITab, idx: number) => emits('close', tab, idx)"
            @refresh="emits('refresh')"
            @close-current="emits('closeCurrent')"
            @close-left="emits('closeLeft')"
            @close-right="emits('closeRight')"
            @close-other="emits('closeOther')"
            @close-all="emits('closeAll')"
            @collect="(idx: number) => emits('collect', idx)"
            @toggle-pin="
              (tab: ITab, pin: boolean) => emits('togglePin', tab, pin)
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
import { DraggableItem } from '@/components/draggable'
import TabItem from './tab-item.vue'

import type { TabListEmits, TabListProps } from '../types'
import type { DragEndEvent } from '@dnd-kit/vue'
import type { ITab } from '#/config'

const { activeKey, showIcon } = defineProps<TabListProps>()

const emits = defineEmits<TabListEmits>()

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
  if (tab) emits('dragEnd', tab)
}
</script>
