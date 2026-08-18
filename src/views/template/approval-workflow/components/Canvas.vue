<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type {
  ApprovalNode,
  ApprovalNodeType,
  ApprovalWorkflowSettings,
} from '../types'
import type { ScrollbarInstance } from '@/components/scrollbar'
import { APPROVAL_WORKFLOW_SELECTORS } from '../constants'
import { useApprovalCanvasInteraction } from '../composables/useCanvasInteraction'
import NodeCard from './NodeCard.vue'

const props = defineProps<{
  nodes: readonly ApprovalNode[]
  selectedIds: readonly string[]
  settings: ApprovalWorkflowSettings
}>()

const emit = defineEmits<{
  addAfter: [id: string, type: ApprovalNodeType]
  duplicate: [id: string]
  duplicateSelected: []
  remove: [id: string]
  removeSelected: []
  select: [id: string]
  selectMany: [ids: string[]]
}>()

const canvasRef = useTemplateRef<HTMLElement>('canvas')
const canvasScrollbarRef = useTemplateRef<ScrollbarInstance>('canvasScrollbar')
const selectedIdsRef = computed(() => props.selectedIds)
const {
  canvasContentStyle,
  marqueeSelectedIds,
  selecting,
  selectionRect,
  zoom,
  zoomLabel,
  handleWheel,
  setZoom,
} = useApprovalCanvasInteraction(
  canvasRef,
  selectedIdsRef,
  {
    duplicateSelected: () => emit('duplicateSelected'),
    removeSelected: () => emit('removeSelected'),
    selectMany: (ids) => emit('selectMany', ids),
  },
  () => canvasScrollbarRef.value?.getScrollElement() ?? null
)

const activeSelectedIds = computed(() => {
  if (!selecting.value) return props.selectedIds
  return Array.from(
    new Set([...props.selectedIds, ...marqueeSelectedIds.value])
  )
})
const activeSelectedCount = computed(() => activeSelectedIds.value.length)
</script>

<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-page shadow-[var(--w-shadow-elevated)]"
  >
    <header
      class="flex items-center justify-between gap-12 border-b border-color-2 bg-container px-14 py-11"
    >
      <div class="min-w-0">
        <div class="flex items-center gap-8">
          <Icon
            name="i-lucide:git-branch-plus"
            :size="18"
            class="text-primary"
          />
          <h2 class="m-0 truncate text-15px font-800 text-primary">流程设计</h2>
        </div>
        <p class="m-0 mt-3 truncate text-12px text-secondary">
          {{ settings.group }} · {{ settings.version }} ·
          支持条件、并行、抄送、办理和子流程
        </p>
      </div>
      <div class="hidden items-center gap-7 text-11px text-secondary xl:flex">
        <div
          v-if="activeSelectedCount > 1"
          class="mr-4 flex items-center gap-6 rounded-7 border-1 border-primary/25 border-solid bg-primary/8 px-7 py-4 text-primary"
        >
          <span>{{ activeSelectedCount }} 已选</span>
          <a-button size="small" type="text" @click="emit('duplicateSelected')">
            <Icon name="i-lucide:copy" :size="14" />
          </a-button>
          <a-button
            danger
            size="small"
            type="text"
            @click="emit('removeSelected')"
          >
            <Icon name="i-lucide:trash-2" :size="14" />
          </a-button>
        </div>
        <span class="rounded-6 bg-fill px-8 py-4"
          >可撤回 {{ settings.allowRevoke ? 'ON' : 'OFF' }}</span
        >
        <span class="rounded-6 bg-fill px-8 py-4"
          >电子签 {{ settings.enableSignature ? 'ON' : 'OFF' }}</span
        >
        <div
          class="ml-4 inline-flex items-center overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-container"
        >
          <a-button
            class="border-0 rounded-none"
            :data-testid="APPROVAL_WORKFLOW_SELECTORS.zoomOut"
            size="small"
            @click="setZoom(zoom - 0.1)"
          >
            <Icon name="i-lucide:minus" :size="14" />
          </a-button>
          <a-button
            class="min-w-54 border-y-0 rounded-none"
            :data-testid="APPROVAL_WORKFLOW_SELECTORS.zoomReset"
            size="small"
            @click="setZoom(1)"
          >
            {{ zoomLabel }}
          </a-button>
          <a-button
            class="border-0 rounded-none"
            :data-testid="APPROVAL_WORKFLOW_SELECTORS.zoomIn"
            size="small"
            @click="setZoom(zoom + 0.1)"
          >
            <Icon name="i-lucide:plus" :size="14" />
          </a-button>
        </div>
      </div>
    </header>

    <div
      ref="canvas"
      class="relative min-h-0 overflow-hidden select-none bg-page outline-none [background-image:linear-gradient(90deg,rgb(var(--w-border-color-1)/55%)_1px,transparent_1px),linear-gradient(0deg,rgb(var(--w-border-color-1)/55%)_1px,transparent_1px)] [background-size:36px_36px]"
      :data-testid="APPROVAL_WORKFLOW_SELECTORS.canvas"
      tabindex="0"
      @wheel="handleWheel"
    >
      <Scrollbar
        ref="canvasScrollbar"
        class="h-full"
        content-class="approval-canvas-scroll relative min-h-full p-20"
      >
        <div
          class="mx-auto min-w-max pb-40 transition-transform [transform-origin:top_center] [transition-duration:var(--w-motion-duration-base)] [transition-timing-function:var(--w-motion-ease-standard)]"
          :style="canvasContentStyle"
        >
          <NodeCard
            v-for="node in nodes"
            :key="node.id"
            :node="node"
            :selected-ids="activeSelectedIds"
            @add-after="(id, type) => emit('addAfter', id, type)"
            @duplicate="emit('duplicate', $event)"
            @remove="emit('remove', $event)"
            @select="emit('select', $event)"
          />
        </div>
        <div
          v-if="selecting"
          class="approval-selection-rect pointer-events-none absolute left-0 top-0 z-60 rounded-8 border-2 border-primary/85 border-dashed bg-primary/10 shadow-[0_0_0_1px_rgb(var(--w-color-primary)/24%),0_14px_32px_rgb(var(--w-color-primary)/12%)]"
          :style="selectionRect"
        >
          <span
            v-if="marqueeSelectedIds.length > 0"
            class="approval-selection-count absolute left-8 top-8 z-1 inline-flex items-center gap-5 rounded-6 border-1 border-primary/25 border-solid bg-container/96 px-8 py-4 text-11px font-700 text-primary shadow-[var(--w-shadow-card)] backdrop-blur-8"
          >
            <Icon name="i-lucide:mouse-pointer-2" :size="12" />
            已框选 {{ marqueeSelectedIds.length }} 个
          </span>
        </div>
      </Scrollbar>
    </div>
  </section>
</template>

<style scoped>
.approval-selection-rect {
  contain: layout paint;
  isolation: isolate;
}

.approval-selection-rect::before {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    135deg,
    rgb(var(--w-color-primary) / 14%) 0 25%,
    transparent 25% 50%,
    rgb(var(--w-color-primary) / 9%) 50% 75%,
    transparent 75%
  );
  background-size: 16px 16px;
  border-radius: inherit;
  opacity: 0.38;
}

.approval-selection-rect::after {
  position: absolute;
  inset: 2px;
  content: '';
  border: 1px solid rgb(var(--w-color-primary) / 30%);
  border-radius: 6px;
}

.approval-selection-count {
  transform: translateZ(0);
}
</style>
