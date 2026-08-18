<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import type { CSSProperties } from 'vue'
import type { WorkflowNodeData, WorkflowNodeStatus } from '../../types'

interface Props extends NodeProps<WorkflowNodeData> {
  kindLabel: string
}

const props = defineProps<Props>()

const statusText: Record<WorkflowNodeStatus, string> = {
  idle: '待运行',
  running: '运行中',
  success: '成功',
  warning: '需关注',
}

const rootStyle = computed<CSSProperties>(() => {
  const active = props.selected || props.data.status === 'running'

  return {
    borderColor: props.selected ? props.data.accent : undefined,
    boxShadow: active
      ? `0 0 0 4px color-mix(in srgb, ${props.data.accent} 14%, transparent), 0 18px 40px rgb(15 23 42 / 14%)`
      : undefined,
  }
})

const visibleInputs = computed(() => props.data.inputs.slice(0, 2))
const visibleOutputs = computed(() => props.data.outputs.slice(0, 2))
const statusLabel = computed(() => statusText[props.data.status])
const statusDotClass = computed(() => {
  if (props.data.status === 'running') return 'bg-primary animate-pulse'
  if (props.data.status === 'success') return 'bg-success'
  if (props.data.status === 'warning') return 'bg-warning'
  return 'bg-disabled'
})

const metadata = computed(() => {
  return [
    props.data.model,
    props.data.latency,
    props.data.tokens,
    ...Object.entries(props.data.config ?? {})
      .slice(0, 2)
      .map(([key, value]) => `${key}: ${formatConfigValue(value)}`),
  ].filter(Boolean)
})

function formatConfigValue(value: unknown) {
  if (Array.isArray(value)) return `Array(${value.length})`
  if (typeof value === 'object' && value !== null) return 'Object'
  return String(value)
}
</script>

<template>
  <div
    class="workflow-node relative w-292 select-none rounded-12 border-1 border-color-2 border-solid bg-main p-14 text-main shadow-[0_14px_34px_rgb(15_23_42_/_10%)] transition-[border-color,box-shadow,transform] duration-motion-base"
    :class="{ 'workflow-node--dragging scale-[1.01]': dragging }"
    :style="rootStyle"
    data-workflow-node
  >
    <Handle
      v-if="data.inputs.length > 0"
      type="target"
      :position="Position.Left"
      class="!h-12 !w-12 !border-2 !border-solid !bg-container"
      :style="{ left: '-7px', borderColor: data.accent }"
    />

    <div class="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-10">
      <span
        class="size-36 inline-flex items-center justify-center rounded-10"
        :style="{
          color: data.accent,
          backgroundColor: `${data.accent}18`,
        }"
      >
        <Icon :name="data.icon" :size="18" />
      </span>
      <div class="min-w-0 flex flex-col">
        <strong class="truncate text-15px leading-21px">{{
          data.title
        }}</strong>
        <span class="truncate text-xs text-muted leading-18px">
          {{ kindLabel }}
        </span>
      </div>
      <span
        class="inline-flex shrink-0 items-center gap-5 rounded-full bg-fill-quaternary px-7 py-3 text-xs text-regular"
      >
        <i class="size-6 rounded-full" :class="statusDotClass" />
        {{ statusLabel }}
      </span>
    </div>

    <p
      class="m-0 mt-12 min-h-42 overflow-hidden text-13px text-muted leading-21px"
    >
      {{ data.description }}
    </p>

    <div v-if="metadata.length" class="mt-12 flex flex-wrap gap-6">
      <span
        v-for="item in metadata"
        :key="item"
        class="max-w-130 truncate rounded-6 border-1 border-color-secondary border-solid bg-fill-quaternary px-7 py-4 text-xs text-regular leading-16px"
      >
        {{ item }}
      </span>
    </div>

    <div
      v-if="visibleInputs.length || visibleOutputs.length"
      class="mt-12 grid grid-cols-2 gap-8"
    >
      <div v-if="visibleInputs.length" class="min-w-0">
        <span class="mb-6 block text-xs text-placeholder">输入</span>
        <div
          v-for="input in visibleInputs"
          :key="input.name"
          class="min-h-26 min-w-0 flex items-center justify-between gap-6 rounded-6 border-1 border-color-secondary border-solid bg-fill-quaternary px-7 py-4"
        >
          <strong class="min-w-0 truncate text-xs text-main">
            {{ input.name }}
          </strong>
          <small class="shrink-0 truncate text-11px text-placeholder">
            {{ input.type }}
          </small>
        </div>
      </div>

      <div v-if="visibleOutputs.length" class="min-w-0">
        <span class="mb-6 block text-xs text-placeholder">输出</span>
        <div
          v-for="output in visibleOutputs"
          :key="output.name"
          class="min-h-26 min-w-0 flex items-center justify-between gap-6 rounded-6 border-1 border-color-secondary border-solid bg-fill-quaternary px-7 py-4"
        >
          <strong class="min-w-0 truncate text-xs text-main">
            {{ output.name }}
          </strong>
          <small class="shrink-0 truncate text-11px text-placeholder">
            {{ output.type }}
          </small>
        </div>
      </div>
    </div>

    <Handle
      v-if="data.outputs.length > 0"
      type="source"
      :position="Position.Right"
      class="!h-12 !w-12 !border-2 !border-solid !bg-container"
      :style="{ right: '-7px', borderColor: data.accent }"
    />
  </div>
</template>

<style scoped>
.workflow-node--dragging {
  transition: none !important;
  will-change: transform;
}
</style>
