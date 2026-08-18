<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useDraggable } from '@dnd-kit/vue'
import type { DesignerPaletteItem } from '../types'

const props = defineProps<{
  item: DesignerPaletteItem
}>()

const emit = defineEmits<{
  add: [type: DesignerPaletteItem['type']]
}>()

const elementRef = useTemplateRef<HTMLElement>('elementRef')
const { isDragging } = useDraggable({
  data: computed(() => ({
    componentType: props.item.type,
    kind: 'palette' as const,
  })),
  element: elementRef,
  id: computed(() => `low-code-palette:${props.item.type}`),
  type: 'low-code-palette',
})
</script>

<template>
  <button
    ref="elementRef"
    type="button"
    :aria-label="item.title"
    :data-palette-dragging="isDragging || undefined"
    :data-low-code-palette-item="item.type"
    class="group size-40 cursor-grab items-center justify-center rounded-8 border-1 border-color-2 border-solid bg-main text-primary transition-[background-color,border-color,opacity] duration-motion-fast hover:border-color-primary hover:bg-primary/8 active:cursor-grabbing data-[palette-dragging=true]:opacity-40"
    @click="emit('add', item.type)"
  >
    <Icon :name="item.icon" :size="20" />
  </button>
</template>
