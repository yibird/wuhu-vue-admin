<template>
  <div class="h-full min-h-0 flex flex-col overflow-x-hidden overflow-hidden">
    <div
      class="flex-between-center shrink-0 border-0 border-b-1 border-color-2 border-b-solid px-12 py-8"
    >
      <span class="text-xs text-muted">共 {{ nodeCount }} 个节点</span>
      <a-tooltip title="展开/收起全部">
        <button
          class="span-button size-22 inline-flex items-center justify-center text-secondary hover:text-primary"
          type="button"
          @click="toggleExpandAll"
        >
          <Icon
            :name="
              allExpanded
                ? 'i-lucide:chevrons-down-up'
                : 'i-lucide:chevrons-up-down'
            "
            :size="14"
          />
        </button>
      </a-tooltip>
    </div>

    <Scrollbar class="min-h-0 flex-1" :options="{ overflow: { x: 'hidden' } }">
      <div class="min-w-0 p-8">
        <a-tree
          v-if="treeData.length"
          block-node
          draggable
          :tree-data="treeData"
          :selected-keys="selectedKeys"
          :expanded-keys="expandedKeys"
          :allow-drop="allowDrop"
          @select="onSelect"
          @expand="onExpand"
          @drop="onDrop"
          @right-click="onRightClick"
        >
          <template
            #titleRender="{ key, title, icon, locked, hidden, condition }"
          >
            <span class="lc-outline-title" :class="{ 'is-hidden': hidden }">
              <Icon :name="icon || 'i-lucide:box'" :size="13" />
              <span class="truncate">{{ title }}</span>
              <Icon
                v-if="condition"
                name="i-lucide:eye"
                :size="11"
                class="lc-outline-title__tail text-warning"
              />
              <Icon
                v-if="locked"
                name="i-lucide:lock"
                :size="11"
                class="lc-outline-title__tail text-muted"
              />
              <Icon
                v-if="hidden"
                name="i-lucide:eye-off"
                :size="11"
                class="lc-outline-title__tail text-muted"
              />
              <span class="lc-outline-title__actions" @click.stop>
                <button
                  class="span-button size-18 inline-flex items-center justify-center"
                  type="button"
                  title="复制"
                  @click="designer.duplicateNodes([String(key)])"
                >
                  <Icon name="i-lucide:copy" :size="11" />
                </button>
                <button
                  class="span-button size-18 inline-flex items-center justify-center"
                  type="button"
                  title="删除"
                  @click="designer.removeNodes([String(key)])"
                >
                  <Icon name="i-lucide:trash-2" :size="11" />
                </button>
              </span>
            </span>
          </template>
        </a-tree>

        <div v-else class="p-24 text-center text-xs text-muted">
          画布还没有组件，从「组件」面板拖入或点击添加
        </div>
      </div>
    </Scrollbar>

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
import { computed, reactive, ref, watch } from 'vue'
import { Icon, Scrollbar } from '@/components'
import { componentRegistry } from '../../core/registry'
import { ROOT_ID } from '../../core/schema'
import { useDesignerContext } from '../../composables'
import NodeContextMenu from '../canvas/NodeContextMenu.vue'
import type { ComponentSchema } from '../../core/schema/types'

interface TreeItem {
  key: string
  title: string
  icon?: string
  locked?: boolean
  hidden?: boolean
  condition?: boolean
  children?: TreeItem[]
}

const designer = useDesignerContext()

const selectedKeys = computed(() => [...designer.selectedIds.value])
const expandedKeys = ref<string[]>(collectParentKeys())
const menu = reactive<{ open: boolean; x: number; y: number; nodeId?: string }>(
  {
    open: false,
    x: 0,
    y: 0,
    nodeId: undefined,
  }
)

function toTreeItem(node: ComponentSchema): TreeItem {
  return {
    key: node.id,
    title:
      node.name ||
      componentRegistry.getDefinition(node.type)?.title ||
      node.type,
    icon: componentRegistry.getDefinition(node.type)?.icon,
    locked: node.locked,
    hidden: node.hidden,
    condition: !!node.visible,
    children: node.children?.length
      ? node.children.map((child) => toTreeItem(child))
      : undefined,
  }
}

const treeData = computed<TreeItem[]>(() =>
  designer.activePage.value.components.map((node) => toTreeItem(node))
)

const nodeCount = computed(() => {
  let count = 0
  designer.activeIndex.value.walk(() => {
    count += 1
  })
  return count
})

const allExpanded = computed(() => {
  const keys = collectParentKeys()
  return keys.every((key) => expandedKeys.value.includes(key))
})

function collectParentKeys(): string[] {
  const keys: string[] = []
  designer.activeIndex.value.walk((node) => {
    if (node.children?.length) keys.push(node.id)
  })
  return keys
}

function toggleExpandAll() {
  expandedKeys.value = allExpanded.value ? [] : collectParentKeys()
}

function onExpand(keys: string[]) {
  expandedKeys.value = keys.map(String)
}

function onSelect(keys: (string | number)[]) {
  designer.selectMany(keys.map(String))
}

/** antdv 拖拽事件形状：allowDrop 传 dropNode，drop 传 node，这里统一兼容 */
interface TreeDragInfo {
  node?: { key: string | number; pos?: string }
  dropNode?: { key: string | number; pos?: string }
  dragNode?: { key: string | number }
  dropPosition?: number
  dropToGap?: boolean
}

function keyOf(node?: { key: string | number }) {
  return node ? String(node.key) : undefined
}

function allowDrop(info: TreeDragInfo) {
  const dragId = keyOf(info.dragNode)
  const dropId = keyOf(info.dropNode ?? info.node)
  if (!dragId || !dropId || dragId === dropId) return false
  const index = designer.activeIndex.value
  if (!index.get(dragId) || !index.get(dropId)) return false
  // 不允许拖入自己的子树
  if (index.contains(dragId, dropId)) return false
  if (info.dropToGap) return true
  return !!componentRegistry.getDefinition(index.get(dropId)?.type ?? '')
    ?.acceptsChildren
}

function onDrop(info: TreeDragInfo) {
  const dragId = keyOf(info.dragNode)
  const dropNode = info.dropNode ?? info.node
  const dropId = keyOf(dropNode)
  if (!dragId || !dropId || dragId === dropId) return
  const index = designer.activeIndex.value
  if (!index.get(dragId) || !index.get(dropId)) return
  if (index.contains(dragId, dropId)) return

  if (info.dropToGap) {
    const parts = String(dropNode?.pos ?? '').split('-')
    const relative =
      info.dropPosition !== undefined && parts.length
        ? info.dropPosition - Number(parts[parts.length - 1] ?? 0)
        : 0
    const parentId = index.getParentId(dropId)
    const position = index.indexOf(dropId) + (relative > 0 ? 1 : 0)
    const currentParent = index.getParentId(dragId)
    const currentIndex = index.indexOf(dragId)
    // 原地放置不产生历史记录
    if (
      currentParent === parentId &&
      (currentIndex === position || currentIndex + 1 === position)
    ) {
      return
    }
    designer.moveNode(dragId, parentId, position)
    return
  }

  const definition = componentRegistry.getDefinition(
    index.get(dropId)?.type ?? ''
  )
  if (!definition?.acceptsChildren) return
  if (index.getParentId(dragId) === dropId) return
  designer.moveNode(dragId, dropId, index.getChildren(dropId).length)
}

function onRightClick(info: {
  event: MouseEvent
  node: { key: string | number }
}) {
  info.event.preventDefault()
  designer.select(String(info.node.key))
  menu.open = true
  menu.x = info.event.clientX
  menu.y = info.event.clientY
  menu.nodeId = String(info.node.key)
}

watch(selectedKeys, (ids) => {
  const index = designer.activeIndex.value
  const next = new Set(expandedKeys.value)
  for (const id of ids) {
    let parent = index.getParentId(id)
    while (parent !== ROOT_ID) {
      next.add(parent)
      parent = index.getParentId(parent)
    }
  }
  expandedKeys.value = [...next]
})
</script>

<style scoped lang="less">
:deep(.ant-tree) {
  background: transparent;
}

:deep(.ant-tree-treenode) {
  width: 100%;
  padding: 1px 0;
}

.lc-outline-title {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  width: 100%;
  min-width: 0;
  font-size: 12px;

  &.is-hidden {
    color: rgb(var(--w-text-muted));
    text-decoration: line-through;
  }

  &__tail {
    flex: none;
  }

  &__actions {
    display: none;
    gap: 2px;
    align-items: center;
    margin-left: auto;
    color: rgb(var(--w-text-secondary));
  }

  &:hover &__actions {
    display: inline-flex;
  }
}
</style>
