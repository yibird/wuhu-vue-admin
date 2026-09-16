<template>
  <div class="lc-canvas min-h-0 min-w-0 flex flex-col overflow-hidden">
    <div class="lc-canvas__bar shrink-0 px-12 py-8">
      <CanvasToolbar
        :view="view"
        :fullscreen="fullscreen"
        @toggle-fullscreen="emit('toggle-fullscreen')"
      />
    </div>

    <div class="lc-canvas__body min-h-0 flex-1">
      <div
        ref="viewportRef"
        class="lc-canvas__viewport"
        :class="{
          'is-panning': view.panning.value,
          'is-dragging': !!interaction.dragState.value?.active,
        }"
        :style="gridStyle"
        @pointerdown="interaction.onViewportPointerDown"
        @pointerdown.capture="interaction.onResizePointerDown"
        @wheel.prevent="view.handleWheel"
        @dragover="interaction.onViewportDragOver"
        @dragleave="interaction.onViewportDragLeave"
        @drop="interaction.onViewportDrop"
        @contextmenu.prevent="onContextMenu"
      >
        <div
          ref="stageRef"
          class="lc-canvas__stage"
          :style="view.stageStyle.value"
        >
          <div
            class="lc-device"
            data-drop-container="__root__"
            :style="deviceStyle"
          >
            <a-config-provider :theme="{ token: { fontSize: 15 } }">
              <RuntimeProvider :runtime="designer.runtime">
                <DesignNode
                  v-for="node in designer.activePage.value.components"
                  :key="node.id"
                  :node="node"
                />
              </RuntimeProvider>
            </a-config-provider>
            <div
              v-if="!designer.activePage.value.components.length"
              class="lc-device__empty"
            >
              从左侧「组件」面板拖入组件开始设计
            </div>
          </div>

          <div
            v-for="guide in interaction.guides.value"
            :key="guide.id"
            class="lc-guide"
            :class="`is-${guide.orientation}`"
            :style="guideStyle(guide)"
          />

          <template v-if="interaction.dropTarget.value">
            <div
              class="lc-drop-container"
              :class="{ 'is-forbidden': !interaction.dropTarget.value.allowed }"
              :style="containerStyle(interaction.dropTarget.value)"
            />
            <div
              class="lc-drop-indicator"
              :class="`is-${interaction.dropTarget.value.indicator.direction}`"
              :style="indicatorStyle(interaction.dropTarget.value)"
            />
            <div
              v-if="!interaction.dropTarget.value.allowed"
              class="lc-drop-reason"
              :style="reasonStyle(interaction.dropTarget.value)"
            >
              {{ interaction.dropTarget.value.reason }}
            </div>
          </template>

          <div
            v-if="
              interaction.dragState.value?.active &&
              interaction.dragState.value.free
            "
            class="lc-drag-ghost"
            :style="ghostStyle"
          />

          <div
            v-if="interaction.marquee.active"
            class="lc-marquee"
            :style="marqueeStyle"
          />
        </div>
      </div>

      <!-- 标尺浮层：只隐藏标尺本身，不影响画布内容与位置 -->
      <CanvasRuler
        v-if="view.showRulers.value"
        class="lc-canvas__ruler-x"
        orientation="horizontal"
        :view="view"
        :length="viewportSize.width.value"
      />
      <CanvasRuler
        v-if="view.showRulers.value"
        class="lc-canvas__ruler-y"
        orientation="vertical"
        :view="view"
        :length="viewportSize.height.value"
      />
      <div v-if="view.showRulers.value" class="lc-canvas__corner" />
    </div>

    <NodeContextMenu
      :open="menu.open"
      :x="menu.x"
      :y="menu.y"
      :node-id="menu.nodeId"
      @close="menu.open = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
  shallowRef,
  watch,
} from 'vue'
import type { CSSProperties } from 'vue'
import { RuntimeProvider } from '../runtime'
import DesignNode from './DesignNode.vue'
import CanvasRuler from './CanvasRuler.vue'
import CanvasToolbar from './CanvasToolbar.vue'
import NodeContextMenu from './NodeContextMenu.vue'
import { findNodeElementAt } from '../../utils/canvasGeometry'
import {
  useCanvasInteraction,
  useCanvasView,
  useDesignerContext,
} from '../../composables'
import type { DropTarget, GuideLine } from '../../types'

const props = defineProps<{
  spacePressed: boolean
  fullscreen: boolean
}>()
const emit = defineEmits<{ 'toggle-fullscreen': [] }>()

const designer = useDesignerContext()
const viewportRef = shallowRef<HTMLElement>()
const stageRef = shallowRef<HTMLElement>()
const viewportSize = useElementSize(viewportRef)
const spacePressed = computed(() => props.spacePressed)

const view = useCanvasView({
  viewport: viewportRef,
  deviceSize: () => deviceSize.value,
  contentSize: () => {
    const stage = stageRef.value
    if (!stage) return undefined
    return { width: stage.offsetWidth, height: stage.offsetHeight }
  },
})

const interaction = useCanvasInteraction({
  designer,
  view,
  viewport: viewportRef,
  stage: stageRef,
  spacePressed,
})

const menu = reactive<{
  open: boolean
  x: number
  y: number
  nodeId?: string
}>({ open: false, x: 0, y: 0, nodeId: undefined })

const deviceSize = computed(() => designer.deviceSize.value)

const deviceStyle = computed<CSSProperties>(() => ({
  width: `${deviceSize.value.width}px`,
  minHeight: `${deviceSize.value.height}px`,
}))

const gridStyle = computed<CSSProperties>(() => {
  if (!view.showGrid.value) return {}
  const size = 20 * view.zoom.value
  return {
    backgroundImage:
      'radial-gradient(rgb(var(--w-border-color-2)) 1px, transparent 1px)',
    backgroundSize: `${size}px ${size}px`,
    backgroundPosition: `${view.panX.value}px ${view.panY.value}px`,
  }
})

function indicatorStyle(target: DropTarget): CSSProperties {
  const { indicator } = target
  if (indicator.direction === 'vertical') {
    return {
      left: `${indicator.x - 1}px`,
      top: `${indicator.y}px`,
      width: '2px',
      height: `${indicator.length}px`,
    }
  }
  return {
    left: `${indicator.x}px`,
    top: `${indicator.y - 1}px`,
    width: `${indicator.length}px`,
    height: '2px',
  }
}

function containerStyle(target: DropTarget): CSSProperties {
  return {
    left: `${target.containerRect.x}px`,
    top: `${target.containerRect.y}px`,
    width: `${target.containerRect.width}px`,
    height: `${target.containerRect.height}px`,
  }
}

function reasonStyle(target: DropTarget): CSSProperties {
  return {
    left: `${target.containerRect.x + 8}px`,
    top: `${target.containerRect.y + 8}px`,
  }
}

function guideStyle(guide: GuideLine): CSSProperties {
  if (guide.orientation === 'vertical') {
    return {
      left: `${guide.position}px`,
      top: `${guide.start}px`,
      width: '1px',
      height: `${Math.max(guide.end - guide.start, 0)}px`,
    }
  }
  return {
    left: `${guide.start}px`,
    top: `${guide.position}px`,
    width: `${Math.max(guide.end - guide.start, 0)}px`,
    height: '1px',
  }
}

const ghostStyle = computed<CSSProperties>(() => {
  const state = interaction.dragState.value
  if (!state?.free) return {}
  return {
    left: `${state.free.left}px`,
    top: `${state.free.top}px`,
    width: `${state.freeSize?.width ?? 0}px`,
    height: `${state.freeSize?.height ?? 0}px`,
  }
})

const marqueeStyle = computed<CSSProperties>(() => {
  const { startX, startY, currentX, currentY } = interaction.marquee
  return {
    left: `${Math.min(startX, currentX)}px`,
    top: `${Math.min(startY, currentY)}px`,
    width: `${Math.abs(currentX - startX)}px`,
    height: `${Math.abs(currentY - startY)}px`,
  }
})

function onContextMenu(event: MouseEvent) {
  const nodeEl = findNodeElementAt(event.clientX, event.clientY)
  if (nodeEl) {
    const id = nodeEl.getAttribute('data-node-id')
    if (id) {
      if (!designer.selectedIds.value.includes(id)) designer.select(id)
      menu.nodeId = id
    }
  } else {
    menu.nodeId = undefined
  }
  menu.open = true
  menu.x = event.clientX
  menu.y = event.clientY
}

watch(
  () => [deviceSize.value.width, deviceSize.value.height, props.fullscreen],
  () => {
    nextTick(() => view.resetPosition())
  }
)

let positioned = false
watch(
  () => [viewportSize.width.value, viewportSize.height.value],
  ([width, height]) => {
    if (positioned || !width || !height) return
    positioned = true
    nextTick(() => view.resetPosition())
  }
)

onBeforeUnmount(() => {
  interaction.onDispose()
})
</script>

<style scoped lang="less">
.lc-canvas__bar {
  background: rgb(var(--w-bg-container));
  border-bottom: 1px solid rgb(var(--w-border-color-2));
}

.lc-canvas__body {
  position: relative;
  overflow: hidden;
  background: rgb(var(--w-bg-page));
}

.lc-canvas__viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: default;
  user-select: none;

  &.is-panning {
    cursor: grabbing;
  }
}

/* 标尺以浮层形式覆盖在画布上：显示/隐藏都不会改变画布尺寸与位置 */
.lc-canvas__ruler-x {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  box-shadow: inset 0 -1px 0 rgb(var(--w-border-color-2));
}

.lc-canvas__ruler-y {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  box-shadow: inset -1px 0 0 rgb(var(--w-border-color-2));
}

.lc-canvas__corner {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 20px;
  height: 20px;
  pointer-events: none;
  background: rgb(var(--w-bg-fill));
  box-shadow: inset -1px -1px 0 rgb(var(--w-border-color-2));
}

.lc-canvas__stage {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

.lc-device {
  position: relative;
  box-sizing: border-box;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 18px 50px rgb(15 23 42 / 12%);
}

.lc-device__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
  margin: 96px 40px 40px;
  font-size: 15px;
  color: rgb(var(--w-text-muted));
  border: 1px dashed rgb(var(--w-border-color-2));
  border-radius: 10px;
}

.lc-drop-indicator {
  position: absolute;
  z-index: 40;
  pointer-events: none;
  background: rgb(var(--w-color-primary));
  border-radius: 2px;

  &.is-horizontal {
    box-shadow: 0 0 0 1px rgb(var(--w-color-primary) / 35%);
  }

  &.is-vertical {
    box-shadow: 0 0 0 1px rgb(var(--w-color-primary) / 35%);
  }
}

.lc-drop-container {
  position: absolute;
  z-index: 35;
  pointer-events: none;
  border: 1px dashed rgb(var(--w-color-primary) / 70%);
  border-radius: 4px;
  box-shadow: inset 0 0 0 9999px rgb(var(--w-color-primary) / 4%);

  &.is-forbidden {
    border-color: rgb(var(--w-color-error) / 70%);
    box-shadow: inset 0 0 0 9999px rgb(var(--w-color-error) / 6%);
  }
}

.lc-drop-reason {
  position: absolute;
  z-index: 42;
  padding: 2px 8px;
  font-size: 11px;
  color: #fff;
  pointer-events: none;
  background: rgb(var(--w-color-error));
  border-radius: 4px;
}

.lc-guide {
  position: absolute;
  z-index: 38;
  pointer-events: none;
  background: rgb(var(--w-color-error));

  &.is-vertical {
    width: 1px;
  }

  &.is-horizontal {
    height: 1px;
  }
}

.lc-drag-ghost {
  position: absolute;
  z-index: 34;
  pointer-events: none;
  background: rgb(var(--w-color-primary) / 8%);
  border: 1px dashed rgb(var(--w-color-primary));
  border-radius: 4px;
}

.lc-marquee {
  position: absolute;
  z-index: 45;
  pointer-events: none;
  background: rgb(var(--w-color-primary) / 12%);
  border: 1px solid rgb(var(--w-color-primary));
}
</style>
