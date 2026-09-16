<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@vue-flow/core'
import type { CSSProperties } from 'vue'
import { getWorkflowNodeDefinition } from '../../../domain'
import type { WorkflowNodeData, WorkflowNodeStatus } from '../../types'

const props = defineProps<NodeProps<WorkflowNodeData>>()

const statusText: Record<WorkflowNodeStatus, string> = {
  failed: '失败',
  idle: '待运行',
  paused: '已暂停',
  queued: '排队中',
  running: '运行中',
  skipped: '已跳过',
  success: '成功',
  warning: '需关注',
}

const kindLabel = computed(
  () => getWorkflowNodeDefinition(props.data.kind)?.title ?? props.data.kind
)

const gradient = computed<[string, string]>(
  () => props.data.gradient ?? [props.data.accent, props.data.accent]
)

const rootStyle = computed<CSSProperties>(() => {
  const [from, to] = gradient.value
  const active = props.selected || props.data.status === 'running'

  return {
    borderColor: props.selected ? from : undefined,
    backgroundImage: `radial-gradient(circle at 0% 0%, color-mix(in srgb, ${from} var(--w-workflow-node-accent-opacity), transparent), transparent var(--w-workflow-node-accent-stop)), linear-gradient(135deg, color-mix(in srgb, ${from} 7%, transparent), transparent 46%, color-mix(in srgb, ${to} 9%, transparent))`,
    boxShadow: active
      ? `0 0 0 var(--w-workflow-node-active-ring-size) color-mix(in srgb, ${from} var(--w-workflow-node-accent-ring-opacity), transparent), var(--w-shadow-node-active)`
      : undefined,
  }
})

const iconStyle = computed<CSSProperties>(() => {
  const [from, to] = gradient.value

  return {
    backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
    boxShadow: `0 6px 16px color-mix(in srgb, ${from} 32%, transparent)`,
  }
})

const visibleInputs = computed(() => props.data.inputs.slice(0, 2))
const visibleOutputs = computed(() => props.data.outputs.slice(0, 2))
const statusLabel = computed(() => statusText[props.data.status])
const statusDotClass = computed(() => {
  if (props.data.status === 'running') return 'bg-primary animate-pulse'
  if (props.data.status === 'success') return 'bg-success'
  if (props.data.status === 'warning') return 'bg-warning'
  if (props.data.status === 'failed') return 'bg-error'
  if (props.data.status === 'paused') return 'bg-warning'
  if (props.data.status === 'queued') return 'bg-info'
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

function handleStyle(index: number, count: number): CSSProperties {
  return {
    top: `${((index + 1) / (count + 1)) * 100}%`,
    borderColor: props.data.accent,
  }
}

function formatConfigValue(value: unknown) {
  if (Array.isArray(value)) return `Array(${value.length})`
  if (typeof value === 'object' && value !== null) return 'Object'
  return String(value)
}
</script>

<template>
  <div
    class="workflow-node relative w-292 select-none rounded-12 border-1 border-color-2 border-solid bg-main p-14 text-main shadow-node transition-[border-color,box-shadow,transform] duration-motion-base ease-motion-standard motion-reduce:transition-none"
    :class="{ 'scale-[1.01] !transition-none will-change-transform': dragging }"
    :style="rootStyle"
    data-workflow-node
  >
    <Handle
      v-for="(input, index) in data.inputs"
      :id="input.id"
      :key="`input-${input.id}`"
      type="target"
      :position="Position.Left"
      :title="`输入：${input.name}`"
      class="!h-12 !w-12 !border-2 !border-solid !bg-container"
      :style="{ ...handleStyle(index, data.inputs.length), left: '-7px' }"
    />

    <div class="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-10">
      <span
        class="size-36 inline-flex items-center justify-center rounded-10 text-white"
        :style="iconStyle"
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
      <span
        v-if="data.breakpoint"
        class="absolute -right-5 -top-5 size-12 rounded-full border-2 border-solid border-main bg-error"
        title="已设置断点"
      />
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
      <div v-if="visibleInputs.length" class="min-w-0 flex flex-col gap-8">
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

      <div v-if="visibleOutputs.length" class="min-w-0 flex flex-col gap-8">
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
      v-for="(output, index) in data.outputs"
      :id="output.id"
      :key="`output-${output.id}`"
      type="source"
      :position="Position.Right"
      :title="`输出：${output.name}`"
      class="!h-12 !w-12 !border-2 !border-solid !bg-container"
      :style="{ ...handleStyle(index, data.outputs.length), right: '-7px' }"
    />
  </div>
</template>
