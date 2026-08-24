<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@vue-flow/core'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<EdgeProps>()

const path = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
    curvature: 0.25,
  })
)
const edgeStyle = computed<CSSProperties>(() => ({
  stroke: props.selected
    ? 'rgb(var(--w-color-primary))'
    : 'rgb(var(--w-text-placeholder))',
  strokeWidth: props.selected ? 2.5 : 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
}))
</script>

<template>
  <BaseEdge
    :id="id"
    :path="path[0]"
    :marker-end="markerEnd"
    :style="edgeStyle"
  />

  <EdgeLabelRenderer>
    <div
      v-if="label"
      class="nodrag nopan inline-flex items-center rounded-full border-1 border-color-secondary border-solid bg-main px-8 py-4 shadow-[0_8px_20px_rgb(15_23_42_/_12%)]"
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px, ${path[2]}px)`,
      }"
    >
      <span class="max-w-80 truncate text-11px text-muted leading-18px">
        {{ label }}
      </span>
    </div>
  </EdgeLabelRenderer>
</template>
