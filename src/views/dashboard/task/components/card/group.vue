<template>
  <div class="max-h-full flex flex-col overflow-hidden rounded-4 bg-container">
    <div class="flex justify-between items-center p-10">
      <a-tag variant="solid" :color="color" class="cursor-pointer">
        {{ text }}
      </a-tag>
      <span class="text-secondary">{{ items.length }}个任务</span>
    </div>
    <Scrollbar
      class="min-w-0 flex-1 overflow-hidden"
      :options="taskGroupScrollbarOptions"
    >
      <div ref="groupRef" class="relative min-h-200 p-10">
        <div class="flex flex-col gap-10">
          <DraggableItem
            v-for="(item, index) in items"
            :key="item.id"
            :data="{ status }"
            :group="groupId"
            :id="item.id"
            :index="index"
            accept="task-card"
            class="task-card-item"
            type="task-card"
          >
            <Item
              :item="item"
              @delete="emit('delete', $event)"
              @edit="emit('edit', $event)"
            />
          </DraggableItem>
        </div>
        <div
          v-if="items.length === 0"
          class="h-180 flex justify-center items-center"
        >
          <a-empty />
        </div>
      </div>
    </Scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { useDroppable } from '@dnd-kit/vue'
import { DraggableItem } from '@/components/draggable'
import Item from './Item.vue'
import type { ScrollbarProps } from '@/components/scrollbar'
import type { CardTaskGroupProps, TaskActionEmits } from '../types'

const props = defineProps<CardTaskGroupProps>()
const emit = defineEmits<TaskActionEmits>()
const groupRef = useTemplateRef<HTMLElement>('groupRef')
const groupId = computed(() => `task-group:${props.status}`)
const taskGroupScrollbarOptions = {
  overflow: { x: 'hidden', y: 'scroll' },
} satisfies ScrollbarProps['options']

useDroppable({
  accept: 'task-card',
  collisionPriority: -1,
  data: computed(() => ({ status: props.status })),
  element: groupRef,
  id: groupId,
  type: 'task-group',
})
</script>

<style scoped>
.task-card-item[data-w-draggable-drag-source='true'] {
  position: relative;
  z-index: 10000;
  user-select: none;
}

.task-card-item[data-w-draggable-dragging='true'] {
  position: relative;
  z-index: 10000 !important;
  pointer-events: none;
  will-change: transform, translate;
}

.task-card-item[data-w-draggable-dragging='true'],
.task-card-item[data-w-draggable-drop-target='true'] {
  margin-block-end: 0 !important;
}

.task-card-item[data-w-draggable-dragging='true'] :deep(.task-card-panel),
.task-card-item[data-w-draggable-drop-target='true'] :deep(.task-card-panel) {
  border-color: rgb(var(--w-color-primary));
  box-shadow: 0 16px 36px rgb(15 23 42 / 18%);
}
</style>
