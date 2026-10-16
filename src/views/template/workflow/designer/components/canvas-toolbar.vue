<script setup lang="ts">
import { Icon } from '@/components'

type CanvasInteractionMode = 'pan' | 'select'

const interactionMode = defineModel<CanvasInteractionMode>('interactionMode', {
  required: true,
})

const props = defineProps<{
  canRedo: boolean
  canRemoveSelected: boolean
  canUndo: boolean
  nodesLocked: boolean
  zoom: number
}>()

const emit = defineEmits<{
  'arrange-nodes': []
  'fit-view': []
  'remove-selected': []
  redo: []
  'toggle-nodes-locked': []
  undo: []
  'zoom-in': []
  'zoom-out': []
  'zoom-reset': []
}>()

const zoomPercent = computed(() => `${Math.round(props.zoom * 100)}%`)

function toggleInteractionMode() {
  interactionMode.value = interactionMode.value === 'select' ? 'pan' : 'select'
}
</script>

<template>
  <div
    role="toolbar"
    aria-label="画布导航"
    class="workflow-canvas-controls absolute bottom-14 left-1/2 z-5 flex -translate-x-1/2 items-center gap-4 rounded-12 border-1 border-color-2 border-solid bg-main p-5 shadow-floating backdrop-blur-10"
  >
    <a-tooltip title="选择模式">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        :class="{
          'bg-fill-tertiary text-primary': interactionMode === 'select',
        }"
        title="选择模式"
        aria-label="选择模式"
        :aria-pressed="interactionMode === 'select'"
        @click="toggleInteractionMode"
      >
        <Icon
          :name="
            interactionMode === 'select'
              ? 'i-lucide:mouse-pointer-2'
              : 'i-lucide:hand'
          "
          :size="16"
        />
      </a-button>
    </a-tooltip>

    <span
      aria-hidden="true"
      class="mx-1 h-18 border-l-1 border-color-2 border-l-solid"
    />
    <a-tooltip title="撤销">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        :disabled="!canUndo"
        title="撤销"
        aria-label="撤销"
        @click="emit('undo')"
      >
        <Icon name="i-lucide:undo-2" :size="16" />
      </a-button>
    </a-tooltip>

    <a-tooltip title="重做">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        :disabled="!canRedo"
        title="重做"
        aria-label="重做"
        @click="emit('redo')"
      >
        <Icon name="i-lucide:redo-2" :size="16" />
      </a-button>
    </a-tooltip>

    <span
      aria-hidden="true"
      class="mx-1 h-18 border-l-1 border-color-2 border-l-solid"
    />
    <a-tooltip title="放大">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        title="放大"
        @click="emit('zoom-in')"
      >
        <Icon name="i-lucide:plus" :size="16" />
      </a-button>
    </a-tooltip>
    <a-tooltip title="缩小">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        title="缩小"
        @click="emit('zoom-out')"
      >
        <Icon name="i-lucide:minus" :size="16" />
      </a-button>
    </a-tooltip>
    <a-tooltip title="重置缩放">
      <a-button
        type="text"
        class="!h-32 !min-w-44 !px-4 text-xs text-regular tabular-nums hover:text-primary"
        title="重置缩放"
        aria-label="重置缩放至 100%"
        @click="emit('zoom-reset')"
      >
        {{ zoomPercent }}
      </a-button>
    </a-tooltip>
    <a-tooltip title="适配画布">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        title="适配画布"
        @click="emit('fit-view')"
      >
        <Icon name="i-lucide:scan" :size="16" />
      </a-button>
    </a-tooltip>
    <a-tooltip title="自动整理节点">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        title="自动整理节点"
        aria-label="自动整理节点"
        @click="emit('arrange-nodes')"
      >
        <Icon name="i-lucide:wand-sparkles" :size="16" />
      </a-button>
    </a-tooltip>
    <a-tooltip :title="nodesLocked ? '解锁节点拖拽' : '锁定节点拖拽'">
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-primary"
        :class="{ 'bg-fill-tertiary text-primary': nodesLocked }"
        :title="nodesLocked ? '解锁节点拖拽' : '锁定节点拖拽'"
        :aria-pressed="nodesLocked"
        @click="emit('toggle-nodes-locked')"
      >
        <Icon
          :name="nodesLocked ? 'i-lucide:lock' : 'i-lucide:unlock'"
          :size="16"
        />
      </a-button>
    </a-tooltip>

    <span
      aria-hidden="true"
      class="mx-1 h-18 border-l-1 border-color-2 border-l-solid"
    />
    <a-tooltip>
      <a-button
        type="text"
        class="!h-32 !w-32 !p-0 text-regular hover:text-error"
        :disabled="!canRemoveSelected"
        title="删除选中节点"
        aria-label="删除选中节点"
        @click="emit('remove-selected')"
      >
        <Icon name="i-lucide:trash-2" :size="16" />
      </a-button>
    </a-tooltip>
  </div>
</template>
