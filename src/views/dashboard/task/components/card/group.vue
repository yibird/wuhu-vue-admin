<template>
  <div
    class="task-group max-h-full flex flex-col overflow-hidden rounded-4 bg-container"
  >
    <div class="flex justify-between items-center p-10">
      <a-tag variant="solid" :color="color" class="cursor-pointer">
        {{ text }}
      </a-tag>
      <span class="text-secondary">{{ items.length }}个任务</span>
    </div>
    <div class="min-w-0 flex-1 w-full h-full overflow-x-hidden overflow-y-auto">
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
              @duplicate="emit('duplicate', $event)"
              @edit="emit('edit', $event)"
              @mark-done="emit('markDone', $event)"
            />
          </DraggableItem>
          <!-- 拖到分组空白处(末尾、空分组)时显示的合成占位盒子,默认隐藏 -->
          <div aria-hidden="true" class="task-group-drop-placeholder" />
        </div>
        <div
          v-if="items.length === 0"
          class="task-group-empty h-180 flex justify-center items-center"
        >
          <a-empty />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDroppable } from '@dnd-kit/vue'
import { DraggableItem } from '@/components/draggable'
import Item from './item.vue'
import type { CardTaskActionEmits, CardTaskGroupProps } from '../types.ts'

defineOptions({ name: 'Group' })

const props = defineProps<CardTaskGroupProps>()
const emit = defineEmits<CardTaskActionEmits>()
const groupRef = useTemplateRef<HTMLElement>('groupRef')
const groupId = computed(() => `task-group:${props.status}`)

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

/*
 * 落位占位卡片:悬停在卡片上时,dnd-kit 会把被拖卡片连同占位克隆
 * 移到乐观位置,这里把占位克隆显示成内容为空的虚线高亮框,标出落点;
 * 写在最后以覆盖拖拽态样式。
 */

/* dnd-kit 默认隐藏列表里的占位克隆,标记落位后恢复可见 */
.task-card-item[data-w-draggable-over='true'][data-dnd-placeholder='hidden'] {
  visibility: visible;
}

.task-card-item[data-w-draggable-over='true'] :deep(.task-card-panel) {
  background-color: rgb(var(--w-color-primary) / 8%);
  border-color: rgb(var(--w-color-primary));
  border-style: dashed;
  box-shadow: 0 0 0 6px rgb(var(--w-color-primary) / 12%);
}

/* 占位克隆内容清空:隐藏内容保留高度,只留虚线高亮框 */
.task-card-item[data-w-draggable-over='true'] :deep(.task-card-panel > *) {
  visibility: hidden;
}

/*
 * 拖到分组空白处(分组末尾、空分组)时显示的合成占位盒子:
 * 内容为空、虚线边框高亮,高度与被拖拽卡片保持一致。
 */
.task-group-drop-placeholder {
  display: none;
}

.task-group [data-w-draggable-group-over='true'] .task-group-drop-placeholder {
  display: block;
  height: var(--task-drop-placeholder-height, 96px);
  background-color: rgb(var(--w-color-primary) / 8%);
  border: 1px dashed rgb(var(--w-color-primary));
  border-radius: 6px;
}

.task-group [data-w-draggable-group-over='true'] .task-group-empty {
  display: none;
}
</style>
