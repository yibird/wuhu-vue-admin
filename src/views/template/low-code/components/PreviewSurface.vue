<script setup lang="ts">
import { computed } from 'vue'
import PreviewNode from './PreviewNode.vue'
import type { DesignerNode, DesignerPreviewSize } from '../types'

const props = defineProps<{
  nodes: DesignerNode[]
  scaleStyle?: Record<string, string>
  size: DesignerPreviewSize
  title: string
}>()

const surfaceStyle = computed(() => ({
  height: `${props.size.height}px`,
  ...props.scaleStyle,
  width: `${props.size.width}px`,
}))
</script>

<template>
  <div
    class="low-code-preview-surface mx-auto flex flex-col overflow-hidden rounded-12 border-1 border-color-2 border-solid bg-main shadow-[0_24px_70px_rgb(15_23_42_/_18%)]"
    :style="surfaceStyle"
  >
    <div
      class="h-42 shrink-0 flex items-center justify-between border-0 border-b-1 border-color-2 border-b-solid bg-fill-quaternary px-14"
    >
      <div class="flex items-center gap-8">
        <span class="size-10 rounded-full bg-error" />
        <span class="size-10 rounded-full bg-warning" />
        <span class="size-10 rounded-full bg-success" />
      </div>
      <span class="max-w-56% truncate text-xs text-muted">{{ title }}</span>
    </div>

    <div class="min-h-0 flex-1 overflow-auto p-14">
      <div v-if="nodes.length" class="grid grid-cols-12 gap-12">
        <PreviewNode v-for="node in nodes" :key="node.id" :node="node" />
      </div>

      <div
        v-else
        class="min-h-full flex items-center justify-center rounded-8 border-1 border-dashed border-color-2 bg-fill-quaternary p-24 text-secondary"
      >
        暂无组件
      </div>
    </div>
  </div>
</template>

<style scoped>
.low-code-preview-surface {
  box-sizing: border-box;
  max-width: none;
  transform-origin: left top;
  transition:
    width var(--w-motion-duration-base) var(--w-motion-ease-standard),
    height var(--w-motion-duration-base) var(--w-motion-ease-standard);
}
</style>
