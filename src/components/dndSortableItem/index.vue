<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useSortable } from '@dnd-kit/vue/sortable'
import type { DndSortableItemProps, DndSortableItemSlots } from './types'

const props = withDefaults(defineProps<DndSortableItemProps>(), {
  tag: 'div',
})
defineSlots<DndSortableItemSlots>()

const elementRef = useTemplateRef<HTMLElement>('elementRef')
const handleRef = computed(() =>
  props.handleSelector
    ? elementRef.value?.querySelector<HTMLElement>(props.handleSelector)
    : undefined
)

const { isDragging, isDropping, isDragSource, isDropTarget } = useSortable({
  accept: computed(() => props.accept),
  collisionPriority: computed(() => props.collisionPriority),
  data: computed(() => props.data),
  disabled: computed(() => props.disabled),
  element: elementRef,
  group: computed(() => props.group),
  handle: handleRef,
  id: computed(() => props.id),
  index: computed(() => props.index),
  type: computed(() => props.type),
})
</script>

<template>
  <component
    :is="tag"
    ref="elementRef"
    :data-sortable-drag-source="isDragSource || undefined"
    :data-sortable-dragging="isDragging || undefined"
    :data-sortable-drop-target="isDropTarget || undefined"
    :data-sortable-dropping="isDropping || undefined"
  >
    <slot
      :is-drag-source="isDragSource"
      :is-dragging="isDragging"
      :is-drop-target="isDropTarget"
      :is-dropping="isDropping"
    />
  </component>
</template>
