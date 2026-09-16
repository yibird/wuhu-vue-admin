<template>
  <div
    v-if="open"
    class="lc-context-menu"
    data-canvas-ui
    :style="{ left: `${x}px`, top: `${y}px` }"
    @pointerdown.stop
    @contextmenu.prevent
  >
    <button class="lc-context-menu__item" type="button" @click="run('copy')">
      <Icon name="i-lucide:copy" :size="13" /> 复制
      <span class="lc-context-menu__shortcut">Ctrl+C</span>
    </button>
    <button
      class="lc-context-menu__item"
      type="button"
      :disabled="!designer.clipboardSize.value"
      @click="run('paste')"
    >
      <Icon name="i-lucide:clipboard-paste" :size="13" /> 粘贴
      <span class="lc-context-menu__shortcut">Ctrl+V</span>
    </button>
    <button
      v-if="nodeId"
      class="lc-context-menu__item"
      type="button"
      @click="run('duplicate')"
    >
      <Icon name="i-lucide:copy-plus" :size="13" /> 创建副本
      <span class="lc-context-menu__shortcut">Ctrl+D</span>
    </button>
    <button
      v-if="nodeId"
      class="lc-context-menu__item is-danger"
      type="button"
      @click="run('delete')"
    >
      <Icon name="i-lucide:trash-2" :size="13" /> 删除
      <span class="lc-context-menu__shortcut">Delete</span>
    </button>

    <template v-if="nodeId">
      <div class="lc-context-menu__divider" />
      <button
        class="lc-context-menu__item"
        type="button"
        :disabled="!canMoveUp"
        @click="run('up')"
      >
        <Icon name="i-lucide:arrow-up" :size="13" /> 上移一层
      </button>
      <button
        class="lc-context-menu__item"
        type="button"
        :disabled="!canMoveDown"
        @click="run('down')"
      >
        <Icon name="i-lucide:arrow-down" :size="13" /> 下移一层
      </button>
      <button class="lc-context-menu__item" type="button" @click="run('front')">
        <Icon name="i-lucide:bring-to-front" :size="13" /> 置于顶层
      </button>
      <button class="lc-context-menu__item" type="button" @click="run('back')">
        <Icon name="i-lucide:send-to-back" :size="13" /> 置于底层
      </button>

      <div class="lc-context-menu__divider" />
      <button
        class="lc-context-menu__item"
        type="button"
        :disabled="!canMoveOut"
        @click="run('move-out')"
      >
        <Icon name="i-lucide:corner-up-left" :size="13" /> 移出容器
      </button>
      <button
        class="lc-context-menu__item"
        type="button"
        :disabled="!canMoveIn"
        @click="run('move-in')"
      >
        <Icon name="i-lucide:corner-down-right" :size="13" /> 移入容器
      </button>
      <button
        class="lc-context-menu__item"
        type="button"
        @click="run('wrap-flex')"
      >
        <Icon name="i-lucide:box" :size="13" /> 包裹进弹性容器
      </button>

      <div class="lc-context-menu__divider" />
      <button class="lc-context-menu__item" type="button" @click="run('lock')">
        <Icon
          :name="node?.locked ? 'i-lucide:unlock' : 'i-lucide:lock'"
          :size="13"
        />
        {{ node?.locked ? '解锁' : '锁定' }}
      </button>
      <button class="lc-context-menu__item" type="button" @click="run('hide')">
        <Icon name="i-lucide:eye-off" :size="13" /> 隐藏
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { Icon } from '@/components'
import { componentRegistry } from '../../core/registry'
import { useDesignerContext } from '../../composables'

const props = defineProps<{
  open: boolean
  x: number
  y: number
  nodeId?: string
}>()

const emit = defineEmits<{
  close: []
  paste: []
}>()

const designer = useDesignerContext()

const node = computed(() =>
  props.nodeId ? designer.activeIndex.value.get(props.nodeId) : undefined
)
const parentId = computed(() =>
  props.nodeId
    ? designer.activeIndex.value.getParentId(props.nodeId)
    : undefined
)
const position = computed(() =>
  props.nodeId ? designer.activeIndex.value.indexOf(props.nodeId) : -1
)
const siblingCount = computed(() =>
  props.nodeId
    ? designer.activeIndex.value.getChildren(parentId.value ?? '').length
    : 0
)
const canMoveUp = computed(() => position.value > 0)
const canMoveDown = computed(
  () => position.value >= 0 && position.value < siblingCount.value - 1
)
const canMoveOut = computed(
  () => !!parentId.value && parentId.value !== '__root__'
)
const canMoveIn = computed(() => {
  if (!props.nodeId) return false
  const index = designer.activeIndex.value
  const siblings = index.getChildren(parentId.value ?? '')
  for (let i = index.indexOf(props.nodeId) - 1; i >= 0; i -= 1) {
    if (componentRegistry.getDefinition(siblings[i].type)?.acceptsChildren) {
      return true
    }
  }
  return false
})

function run(action: string) {
  const id = props.nodeId
  switch (action) {
    case 'copy':
      if (id) designer.select(id)
      designer.copySelection()
      break
    case 'paste':
      designer.pasteClipboard(id)
      emit('paste')
      break
    case 'duplicate':
      if (id) designer.duplicateNodes([id])
      break
    case 'delete':
      if (id) designer.removeNodes([id])
      break
    case 'up':
      if (id) designer.reorderNode(id, 'up')
      break
    case 'down':
      if (id) designer.reorderNode(id, 'down')
      break
    case 'front':
      if (id) designer.bringToFront(id)
      break
    case 'back':
      if (id) designer.sendToBack(id)
      break
    case 'move-out':
      if (id) designer.moveOut(id)
      break
    case 'move-in':
      if (id) designer.moveIn(id)
      break
    case 'wrap-flex':
      if (id) designer.wrapInContainer([id], 'Flex')
      break
    case 'lock':
      if (id) designer.toggleLock(id)
      break
    case 'hide':
      if (id) designer.toggleHidden(id)
      break
    default:
      break
  }
  emit('close')
}

function onGlobalPointerDown(event: PointerEvent) {
  if (!props.open) return
  const target = event.target as HTMLElement
  if (target.closest('.lc-context-menu')) return
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('pointerdown', onGlobalPointerDown, true)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onGlobalPointerDown, true)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped lang="less">
.lc-context-menu {
  position: fixed;
  z-index: 3000;
  min-width: 188px;
  padding: 4px;
  background: rgb(var(--w-bg-elevated));
  border: 1px solid rgb(var(--w-border-color-2));
  border-radius: 8px;
  box-shadow:
    var(--w-shadow-elevated),
    0 2px 6px rgb(15 23 42 / 12%);
}

.lc-context-menu__item {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  color: rgb(var(--w-text-regular));
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 5px;

  &:hover:not(:disabled) {
    color: rgb(var(--w-color-primary));
    background: rgb(var(--w-bg-primary) / 8%);
  }

  &:disabled {
    color: rgb(var(--w-text-disabled));
    cursor: not-allowed;
  }

  &.is-danger:hover:not(:disabled) {
    color: rgb(var(--w-color-error));
    background: rgb(var(--w-color-error) / 8%);
  }
}

.lc-context-menu__shortcut {
  margin-left: auto;
  font-size: 10px;
  color: rgb(var(--w-text-muted));
}

.lc-context-menu__divider {
  height: 1px;
  margin: 4px 2px;
  background: rgb(var(--w-border-color-2));
}
</style>
