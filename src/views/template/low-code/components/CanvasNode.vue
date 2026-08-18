<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useDroppable } from '@dnd-kit/vue'
import { DraggableItem } from '@/components/draggable'
import { canControlAcceptChildren } from './controls/registry'
import { useDesignerNodeClasses } from '../composables/useNodeClasses'
import DesignerNodeRenderer from './NodeRenderer.vue'
import type { DesignerNode } from '../types'

const props = defineProps<{
  activeSelectedIds: Set<string>
  node: DesignerNode
  nodeIndex: number
  parentId?: string
}>()

const emit = defineEmits<{
  contextmenu: [event: MouseEvent, node: DesignerNode]
  select: [node: DesignerNode]
}>()

function handleChildContextMenu(event: MouseEvent, targetNode: DesignerNode) {
  emit('contextmenu', event, targetNode)
}

function handleChildSelect(targetNode: DesignerNode) {
  emit('select', targetNode)
}

const { getNodeClass } = useDesignerNodeClasses()

const isContainer = computed(() => canControlAcceptChildren(props.node.type))
const isSelected = computed(() => props.activeSelectedIds.has(props.node.id))
const children = computed(() => props.node.children ?? [])
const groupId = computed(() => `low-code-group:${props.parentId ?? 'root'}`)
const sortableData = computed(() => ({
  index: props.nodeIndex,
  kind: 'node' as const,
  nodeId: props.node.id,
  parentId: props.parentId,
}))
const containerDropRef = useTemplateRef<HTMLElement>('containerDropRef')

const { isDropTarget: isContainerDropTarget } = useDroppable({
  accept: ['low-code-node', 'low-code-palette'],
  collisionPriority: 1,
  data: computed(() => ({
    index: children.value.length,
    kind: 'container' as const,
    parentId: props.node.id,
  })),
  disabled: computed(() => !isContainer.value),
  element: containerDropRef,
  id: computed(() => `low-code-container:${props.node.id}`),
  type: 'low-code-container',
})

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
  <DraggableItem
    :id="node.id"
    :index="nodeIndex"
    :group="groupId"
    :data="sortableData"
    accept="low-code-node"
    tag="section"
    type="low-code-node"
    :data-low-code-node-id="node.id"
    :data-low-code-node-selected="isSelected ? 'true' : undefined"
    :data-low-code-container-id="isContainer ? node.id : undefined"
    :data-low-code-container-child-count="
      isContainer ? children.length : undefined
    "
    :class="getNodeClass(node, isSelected)"
    :style="gridStyle"
    @contextmenu="emit('contextmenu', $event, node)"
    @click.stop="emit('select', node)"
    @selectstart.prevent
  >
    <div class="low-code-designer-node__content" inert>
      <DesignerNodeRenderer :node="node" />
    </div>

    <div
      v-if="isContainer"
      ref="containerDropRef"
      data-low-code-container-drop-zone
      :data-dnd-drop-target="isContainerDropTarget || undefined"
      :data-low-code-container-id="node.id"
      :data-low-code-container-child-count="children.length"
      class="mt-12 rounded-8 border-1 border-dashed border-color-2 bg-fill-quaternary p-10"
    >
      <!-- 容器组件的子节点直接写入 JSONSchema.children，避免画布结构和源码结构脱节。 -->
      <div
        v-if="children.length"
        class="grid grid-cols-12 gap-10"
        data-low-code-node-list
      >
        <CanvasNode
          v-for="(child, childIndex) in children"
          :key="child.id"
          :active-selected-ids="activeSelectedIds"
          :node="child"
          :node-index="childIndex"
          :parent-id="node.id"
          @contextmenu="handleChildContextMenu"
          @select="handleChildSelect"
        />
      </div>
      <div
        v-else
        class="min-h-72 flex items-center justify-center rounded-6 bg-container text-12px text-secondary"
      >
        拖入控件到容器内部
      </div>
    </div>
  </DraggableItem>
</template>

<style scoped>
.low-code-designer-node__content {
  pointer-events: none;
}

.low-code-designer-node__content :deep(*) {
  pointer-events: none !important;
}

[data-low-code-container-drop-zone][data-dnd-drop-target='true'] {
  background: rgb(var(--w-color-primary) / 8%) !important;
  border-color: rgb(var(--w-color-primary)) !important;
  box-shadow: inset 0 0 0 1px rgb(var(--w-color-primary) / 24%);
}
</style>
