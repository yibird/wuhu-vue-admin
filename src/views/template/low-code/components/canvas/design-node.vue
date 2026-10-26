<template>
  <div
    ref="rootRef"
    class="lc-design-node"
    :class="{
      'is-selected': selected,
      'is-hovered': hovered && !selected,
      'is-locked': node.locked,
      'is-condition-hidden': binding.conditionHidden.value,
      'is-container': binding.acceptsChildren.value,
      'is-floating-inside': floatingInside,
    }"
    :data-node-id="node.id"
    :data-drop-container="binding.acceptsChildren.value ? node.id : undefined"
    :style="binding.style.value"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
  >
    <component
      :is="binding.component.value"
      v-if="binding.component.value"
      v-bind="binding.resolvedProps.value"
      :disabled="binding.disabled.value || undefined"
      v-on="binding.listeners.value"
    >
      <template v-if="binding.acceptsChildren.value" #[binding.slotName.value]>
        <DesignNode
          v-for="child in visibleChildren"
          :key="child.id"
          :node="child"
          :parent-layout="binding.layout.value"
          :parent-direction="binding.direction.value"
        />
      </template>
    </component>

    <div
      v-if="binding.acceptsChildren.value && !visibleChildren.length"
      class="lc-design-node__empty"
    >
      拖拽组件到此处
    </div>

    <template v-if="selected">
      <NodeActionBar
        v-if="primary"
        :node-id="node.id"
        :inside="floatingInside"
      />
      <NodeResizeHandles v-if="primary && !node.locked" />
      <div class="lc-design-node__badge">
        <Icon
          v-if="binding.definition.value?.icon"
          :name="binding.definition.value.icon"
          :size="11"
        />
        <span class="truncate">{{ label }}</span>
        <span v-if="node.locked" class="lc-design-node__lock">
          <Icon name="i-lucide:lock" :size="10" />
        </span>
      </div>
    </template>
    <div v-else-if="hovered" class="lc-design-node__hint">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  toRef,
  watch,
} from 'vue'
import { Icon } from '@/components/icon'
import { useDesignerContext } from '../../hooks/useDesignerContext'
import { useNodeBinding } from '../../hooks/useNodeBinding'
import NodeActionBar from './node-action-bar.vue'
import NodeResizeHandles from './node-resize-handles.vue'
import type { ComponentSchema, LayoutMode } from '../../core/schema/types'

const props = withDefaults(
  defineProps<{
    node: ComponentSchema
    parentLayout?: LayoutMode
    parentDirection?: 'row' | 'column'
  }>(),
  {
    parentLayout: 'block',
    parentDirection: undefined,
  }
)

const designer = useDesignerContext()
const binding = useNodeBinding(
  props.node,
  toRef(props, 'parentLayout'),
  'design',
  toRef(props, 'parentDirection')
)

const selected = computed(() =>
  designer.selectedIds.value.includes(props.node.id)
)
const primary = computed(
  () => designer.primarySelectedId.value === props.node.id
)
const hovered = computed(() => designer.hoveredId.value === props.node.id)

const label = computed(
  () => props.node.name || binding.definition.value?.title || props.node.type
)

const visibleChildren = computed(() =>
  (props.node.children ?? []).filter((child) => !child.hidden)
)

const rootRef = shallowRef<HTMLElement>()
/**
 * 选中工具条与标签默认浮在节点上方，节点贴近画布顶部时会被画布工具栏遮挡，
 * 此时改为贴到节点内部显示
 */
const floatingInside = ref(false)
/** 节点上方需要预留的高度（操作条高度 + 间距） */
const FLOATING_RESERVED_HEIGHT = 44

let measureFrame = 0
let stageObserver: MutationObserver | undefined
let resizeObserver: ResizeObserver | undefined

function measureFloating() {
  measureFrame = 0
  const el = rootRef.value
  if (!el || !selected.value) return
  const viewport = el.closest<HTMLElement>('.lc-canvas__viewport')
  if (!viewport) return
  const offsetTop =
    el.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  floatingInside.value = offsetTop < FLOATING_RESERVED_HEIGHT
}

function scheduleFloatingMeasure() {
  if (measureFrame) return
  measureFrame = requestAnimationFrame(measureFloating)
}

function startFloatingObserve() {
  const el = rootRef.value
  const stage = el?.closest<HTMLElement>('.lc-canvas__stage')
  // 画布平移/缩放会直接改写 stage 的行内 transform
  if (stage && !stageObserver) {
    stageObserver = new MutationObserver(scheduleFloatingMeasure)
    stageObserver.observe(stage, {
      attributes: true,
      attributeFilter: ['style'],
    })
  }
  if (el && !resizeObserver) {
    resizeObserver = new ResizeObserver(scheduleFloatingMeasure)
    resizeObserver.observe(el)
  }
}

function stopFloatingObserve() {
  stageObserver?.disconnect()
  stageObserver = undefined
  resizeObserver?.disconnect()
  resizeObserver = undefined
  if (measureFrame) cancelAnimationFrame(measureFrame)
  measureFrame = 0
}

watch(selected, (value) => {
  if (!value) {
    floatingInside.value = false
    stopFloatingObserve()
    return
  }
  nextTick(() => {
    startFloatingObserve()
    scheduleFloatingMeasure()
  })
})

// 节点位置受兄弟节点与自身样式影响，历史、设备尺寸变化后重新测量
watch(
  () => [
    designer.historyVersion.value,
    designer.deviceSize.value.width,
    designer.previewDevice.value,
  ],
  scheduleFloatingMeasure
)

onBeforeUnmount(stopFloatingObserve)

function onEnter() {
  designer.hoveredId.value = props.node.id
}

function onLeave(event: PointerEvent) {
  const related = event.relatedTarget
  if (
    related instanceof Node &&
    event.currentTarget instanceof HTMLElement &&
    event.currentTarget.contains(related)
  ) {
    return
  }
  if (designer.hoveredId.value === props.node.id) {
    designer.hoveredId.value = undefined
  }
}
</script>

<style scoped lang="less">
.lc-design-node {
  position: relative;
  box-sizing: border-box;
  min-width: 0;

  /**
   * 设计态下控件内容不接收指针事件，避免点击时聚焦输入框、日期框等内部控件；
   * 嵌套的设计节点与画布 UI（操作条/缩放手柄）重新启用，保证子节点仍可选中。
   */
  & > :deep(*) {
    pointer-events: none;
  }

  & > :deep([data-canvas-ui]),
  & :deep(.lc-design-node) {
    pointer-events: auto;
  }

  &:hover {
    z-index: 4;
  }

  /**
   * 使用伪元素绘制高亮环：
   * outline 会落在子组件背景之下，被卡片等自带背景的控件遮住。
   */
  &::after {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    content: '';
    border-radius: 2px;
  }

  &.is-selected {
    z-index: 5;

    &::after {
      border: 2px solid rgb(var(--w-color-primary));
    }
  }

  &.is-hovered::after {
    border: 1px dashed rgb(var(--w-color-primary) / 70%);
  }

  &.is-locked {
    cursor: not-allowed;
  }

  &.is-condition-hidden {
    &::after {
      border: 1px dashed rgb(var(--w-color-warning) / 80%);
    }

    & > :deep(*) {
      opacity: 0.45;
    }
  }
}

.lc-design-node__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgb(var(--w-text-muted));
  white-space: nowrap;
  pointer-events: none;
}

.lc-design-node__badge {
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: 20;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  max-width: 90%;
  padding: 2px 7px;
  font-size: 12px;
  line-height: 17px;
  color: #fff;
  background: rgb(var(--w-color-primary));
  border-radius: 4px 0 6px;
  transform: translateY(-100%);
}

/* 节点贴近画布顶部时，标签贴到节点内部，避免被画布工具栏遮挡 */
.lc-design-node.is-floating-inside .lc-design-node__badge {
  top: 2px;
  left: 2px;
  transform: none;
}

.lc-design-node__lock {
  display: inline-flex;
  align-items: center;
}

.lc-design-node__hint {
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: 15;
  padding: 2px 7px;
  font-size: 12px;
  line-height: 17px;
  color: rgb(var(--w-color-primary));
  pointer-events: none;
  background: rgb(var(--w-bg-overlay));
  border: 1px solid rgb(var(--w-color-primary));
  border-radius: 4px;
  transform: translateY(-100%);
}
</style>
