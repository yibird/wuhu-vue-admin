<script setup lang="ts">
import { computed } from 'vue'
import NodeRenderer from './NodeRenderer.vue'
import type { DesignerNode } from '../types'

const props = defineProps<{
  node: DesignerNode
}>()

const children = computed(() => props.node.children ?? [])

const gridStyle = computed(() => {
  const span = Math.min(
    Math.max(Number(props.node.style.gridColumn ?? 12), 1),
    12
  )
  return {
    gridColumn: `span ${span} / span ${span}`,
  }
})
</script>

<template>
  <section
    class="rounded-8 border-1 border-color-2 border-solid bg-container p-14 shadow-sm"
    :style="gridStyle"
  >
    <NodeRenderer :node="node" />

    <div
      v-if="children.length"
      class="mt-12 grid grid-cols-12 gap-10 rounded-8 border-1 border-dashed border-color-2 bg-fill-quaternary p-10"
    >
      <!-- 预览按 children 递归渲染，确保源码、画布、预览三处层级一致。 -->
      <DesignerPreviewNode
        v-for="child in children"
        :key="child.id"
        :node="child"
      />
    </div>
  </section>
</template>
