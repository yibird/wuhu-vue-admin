<template>
  <div class="lc-node-actions" data-canvas-ui>
    <a-tooltip title="复制" placement="top">
      <button
        class="lc-node-actions__btn"
        type="button"
        @click.stop="designer.duplicateNodes([nodeId])"
      >
        <Icon name="i-lucide:copy" :size="15" />
      </button>
    </a-tooltip>
    <a-tooltip title="上移一层" placement="top">
      <button
        class="lc-node-actions__btn"
        type="button"
        :disabled="!canMoveUp"
        @click.stop="designer.reorderNode(nodeId, 'up')"
      >
        <Icon name="i-lucide:arrow-up" :size="15" />
      </button>
    </a-tooltip>
    <a-tooltip title="下移一层" placement="top">
      <button
        class="lc-node-actions__btn"
        type="button"
        :disabled="!canMoveDown"
        @click.stop="designer.reorderNode(nodeId, 'down')"
      >
        <Icon name="i-lucide:arrow-down" :size="15" />
      </button>
    </a-tooltip>
    <a-tooltip title="删除" placement="top">
      <button
        class="lc-node-actions__btn is-danger"
        type="button"
        @click.stop="designer.removeNodes([nodeId])"
      >
        <Icon name="i-lucide:trash-2" :size="15" />
      </button>
    </a-tooltip>
    <a-dropdown
      :menu="{ items: moreItems, onClick: onMoreClick }"
      :trigger="['click']"
      placement="bottomRight"
    >
      <button class="lc-node-actions__btn" type="button" @click.stop>
        <Icon name="i-lucide:ellipsis" :size="15" />
      </button>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@/components'
import { ROOT_ID } from '../../core/schema'
import { useDesignerContext } from '../../composables'

const props = defineProps<{ nodeId: string }>()
const designer = useDesignerContext()

const parentId = computed(() =>
  designer.activeIndex.value.getParentId(props.nodeId)
)
const position = computed(() =>
  designer.activeIndex.value.indexOf(props.nodeId)
)
const siblingCount = computed(
  () => designer.activeIndex.value.getChildren(parentId.value).length
)
const node = computed(() => designer.activeIndex.value.get(props.nodeId))
const canMoveUp = computed(() => position.value > 0)
const canMoveDown = computed(() => position.value < siblingCount.value - 1)
const canMoveOut = computed(() => parentId.value !== ROOT_ID)

const moreItems = computed(() => [
  { key: 'bring-front', label: '置于顶层' },
  { key: 'send-back', label: '置于底层' },
  { type: 'divider' as const },
  { key: 'move-out', label: '移出容器', disabled: !canMoveOut.value },
  { key: 'wrap-flex', label: '包裹进弹性容器' },
  { key: 'wrap-grid', label: '包裹进栅格容器' },
  { type: 'divider' as const },
  { key: 'lock', label: node.value?.locked ? '解锁' : '锁定' },
  { key: 'hide', label: '隐藏' },
])

function onMoreClick({ key }: { key: string | number }) {
  switch (key) {
    case 'bring-front':
      designer.bringToFront(props.nodeId)
      break
    case 'send-back':
      designer.sendToBack(props.nodeId)
      break
    case 'move-out':
      designer.moveOut(props.nodeId)
      break
    case 'wrap-flex':
      designer.wrapInContainer([props.nodeId], 'Flex')
      break
    case 'wrap-grid':
      designer.wrapInContainer([props.nodeId], 'Grid')
      break
    case 'lock':
      designer.toggleLock(props.nodeId)
      break
    case 'hide':
      designer.toggleHidden(props.nodeId)
      break
    default:
      break
  }
}
</script>

<style scoped lang="less">
.lc-node-actions {
  position: absolute;
  top: -2px;
  right: -2px;
  z-index: 20;
  display: inline-flex;
  gap: 3px;
  align-items: center;
  padding: 4px;
  background: rgb(var(--w-bg-elevated));
  border-radius: 10px;
  box-shadow:
    var(--w-shadow-elevated),
    0 2px 6px rgb(15 23 42 / 12%);
  transform: translateY(-100%);
}

.lc-node-actions__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgb(var(--w-text-secondary));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 10%);
  }

  &:disabled {
    color: rgb(var(--w-text-disabled));
    cursor: not-allowed;
  }

  &.is-danger:hover:not(:disabled) {
    color: rgb(var(--w-color-error));
    background: rgb(var(--w-color-error) / 10%);
  }
}
</style>
