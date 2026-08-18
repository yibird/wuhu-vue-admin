<script setup lang="ts">
import type { DesignerNode } from '../types'
import { canControlAcceptChildren } from './controls/registry'

const props = defineProps<{
  index?: number
  node?: DesignerNode
  nodeCount: number
  selected: boolean
  title: string
  type: 'component' | 'page'
}>()

const emit = defineEmits<{
  duplicate: [id: string]
  moveDown: [id: string]
  moveUp: [id: string]
  remove: [id: string]
}>()

function emitNodeAction(
  action: 'duplicate' | 'moveDown' | 'moveUp' | 'remove'
) {
  if (!props.node) return
  if (action === 'duplicate') {
    emit('duplicate', props.node.id)
    return
  }
  if (action === 'moveDown') {
    emit('moveDown', props.node.id)
    return
  }
  if (action === 'moveUp') {
    emit('moveUp', props.node.id)
    return
  }
  emit('remove', props.node.id)
}
</script>

<template>
  <div
    class="designer-structure-tree-title"
    :class="{
      'designer-structure-tree-title--active': selected,
      'designer-structure-tree-title--page': type === 'page',
    }"
  >
    <span class="designer-structure-tree-title__icon">
      <Icon
        :name="type === 'page' ? 'i-lucide:file-tree' : 'i-lucide:box'"
        :size="15"
      />
    </span>

    <span class="designer-structure-tree-title__content">
      <strong>{{ title }}</strong>
      <small v-if="node">
        {{ node.type }} · {{ node.style.gridColumn ?? 12 }} 栅格
        {{ canControlAcceptChildren(node.type) ? ' · 容器' : '' }}
      </small>
      <small v-else>{{ nodeCount }} 个组件 · Grid 12</small>
    </span>

    <span v-if="node" class="designer-structure-tree-title__tools">
      <button
        type="button"
        class="designer-structure-tree-title__tool"
        title="上移"
        :disabled="index === 0"
        @click.stop="emitNodeAction('moveUp')"
      >
        <Icon name="i-lucide:arrow-up" :size="14" />
      </button>
      <button
        type="button"
        class="designer-structure-tree-title__tool"
        title="下移"
        :disabled="index === nodeCount - 1"
        @click.stop="emitNodeAction('moveDown')"
      >
        <Icon name="i-lucide:arrow-down" :size="14" />
      </button>
      <button
        type="button"
        class="designer-structure-tree-title__tool"
        title="复制"
        @click.stop="emitNodeAction('duplicate')"
      >
        <Icon name="i-lucide:copy" :size="14" />
      </button>
      <button
        type="button"
        class="designer-structure-tree-title__tool designer-structure-tree-title__tool--danger"
        title="删除"
        @click.stop="emitNodeAction('remove')"
      >
        <Icon name="i-lucide:trash-2" :size="14" />
      </button>
    </span>
  </div>
</template>

<style scoped lang="less">
.designer-structure-tree-title {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-width: 0;
  min-height: 36px;
  padding: 5px 7px;
  border: 1px solid transparent;
  border-radius: 6px;
  transition:
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    box-shadow var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.designer-structure-tree-title--page {
  background: rgb(var(--w-bg-fill) / 55%);
  border-color: rgb(var(--w-border-color-1));
}

.designer-structure-tree-title--active {
  background: rgb(var(--w-color-primary) / 8%);
  border-color: rgb(var(--w-color-primary) / 32%);
  box-shadow: inset 2px 0 0 rgb(var(--w-color-primary));
}

.designer-structure-tree-title__icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border-radius: 6px;
}

.designer-structure-tree-title__content {
  min-width: 0;
}

.designer-structure-tree-title__content strong,
.designer-structure-tree-title__content small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.designer-structure-tree-title__content strong {
  color: rgb(var(--w-text-color));
}

.designer-structure-tree-title__content small {
  margin-top: 2px;
  font-size: 12px;
  color: rgb(var(--w-text-color-3));
}

.designer-structure-tree-title__tools {
  display: flex;
  gap: 4px;
  padding: 2px;
  pointer-events: none;
  background: rgb(var(--w-bg-container) / 92%);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  opacity: 0;
  transition: opacity var(--w-motion-duration-base)
    var(--w-motion-ease-standard);
}

.designer-structure-tree-title:hover .designer-structure-tree-title__tools,
.designer-structure-tree-title:focus-within
  .designer-structure-tree-title__tools,
.designer-structure-tree-title--active .designer-structure-tree-title__tools {
  pointer-events: auto;
  opacity: 1;
}

.designer-structure-tree-title__tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  color: rgb(var(--w-text-color-3));
  cursor: pointer;
  background: rgb(var(--w-bg-container));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 6px;
  transition:
    color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    background-color var(--w-motion-duration-base) var(--w-motion-ease-standard),
    border-color var(--w-motion-duration-base) var(--w-motion-ease-standard);
}

.designer-structure-tree-title__tool:hover {
  color: rgb(var(--w-color-primary));
  background: rgb(var(--w-color-primary) / 10%);
  border-color: rgb(var(--w-color-primary) / 30%);
}

.designer-structure-tree-title__tool:disabled {
  color: rgb(var(--w-text-color-3) / 48%);
  cursor: not-allowed;
  background: rgb(var(--w-bg-page));
  border-color: rgb(var(--w-border-color-1));
}

.designer-structure-tree-title__tool--danger:hover {
  color: rgb(var(--w-color-error));
  background: rgb(var(--w-color-error) / 10%);
  border-color: rgb(var(--w-color-error) / 30%);
}
</style>
