<template>
  <div
    class="lc-design-node"
    :class="{
      'is-selected': selected,
      'is-hovered': hovered && !selected,
      'is-locked': node.locked,
      'is-condition-hidden': binding.conditionHidden.value,
      'is-container': binding.acceptsChildren.value,
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
      <NodeActionBar v-if="primary" :node-id="node.id" />
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
import { computed, toRef } from 'vue'
import { Icon } from '@/components'
import { useDesignerContext } from '../../composables/useDesignerContext'
import { useNodeBinding } from '../../composables/useNodeBinding'
import NodeActionBar from './NodeActionBar.vue'
import NodeResizeHandles from './NodeResizeHandles.vue'
import type { ComponentSchema, LayoutMode } from '../../core/schema/types'

const props = withDefaults(
  defineProps<{
    node: ComponentSchema
    parentLayout?: LayoutMode
  }>(),
  {
    parentLayout: 'block',
  }
)

const designer = useDesignerContext()
const binding = useNodeBinding(
  props.node,
  toRef(props, 'parentLayout'),
  'design'
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
  transition:
    outline-color 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    z-index: 4;
  }

  &.is-selected {
    z-index: 5;
    outline: 2px solid rgb(var(--w-color-primary));
    outline-offset: -2px;
  }

  &.is-hovered {
    outline: 1px dashed rgb(var(--w-color-primary) / 70%);
    outline-offset: -1px;
  }

  &.is-locked {
    cursor: not-allowed;
  }

  &.is-condition-hidden {
    outline: 1px dashed rgb(var(--w-color-warning) / 80%);
    outline-offset: -1px;

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
  pointer-events: none;
  background: repeating-linear-gradient(
    -45deg,
    rgb(var(--w-bg-fill)),
    rgb(var(--w-bg-fill)) 6px,
    transparent 6px,
    transparent 12px
  );
  border: 1px dashed rgb(var(--w-border-color-2));
  border-radius: 6px;
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
  background: rgb(var(--w-bg-elevated));
  border: 1px solid rgb(var(--w-color-primary));
  border-radius: 4px;
  transform: translateY(-100%);
}
</style>
