import { computed, nextTick, shallowRef } from 'vue'
import type { ApprovalNode, ApprovalNodeType } from '../types'

type ContextMenuKey =
  | 'add-approver'
  | 'add-cc'
  | 'add-condition'
  | 'duplicate'
  | 'move-up'
  | 'move-down'
  | 'remove'
  | 'select'

interface ApprovalNodeContextMenuActions {
  addAfter: (id: string, type: ApprovalNodeType) => void
  duplicate: (id: string) => void
  move: (id: string, offset: -1 | 1) => void
  remove: (id: string) => void
  select: (id: string) => void
}

const contextMenuKeys = new Set<string>([
  'add-approver',
  'add-cc',
  'add-condition',
  'duplicate',
  'move-up',
  'move-down',
  'remove',
  'select',
])

function isContextMenuKey(key: string): key is ContextMenuKey {
  return contextMenuKeys.has(key)
}

export function useApprovalNodeContextMenu(
  getNode: () => ApprovalNode,
  actions: ApprovalNodeContextMenuActions
) {
  const contextMenuOpen = shallowRef(false)
  const contextMenuX = shallowRef(0)
  const contextMenuY = shallowRef(0)

  const contextMenuItems = computed(() => {
    const node = getNode()

    return [
      { key: 'select', label: '选中节点' },
      { type: 'divider' },
      {
        key: 'add-approver',
        label: '添加审批人',
        disabled: node.type === 'end',
      },
      {
        key: 'add-condition',
        label: '添加条件分支',
        disabled: node.type === 'end',
      },
      {
        key: 'add-cc',
        label: '添加抄送人',
        disabled: node.type === 'end',
      },
      { type: 'divider' },
      {
        key: 'move-up',
        label: '上移节点',
        disabled: node.required,
      },
      {
        key: 'move-down',
        label: '下移节点',
        disabled: node.required,
      },
      {
        key: 'duplicate',
        label: '复制节点',
        disabled: node.required,
      },
      {
        key: 'remove',
        label: '删除节点',
        danger: true,
        disabled: node.required,
      },
    ]
  })

  const contextMenuAnchorStyle = computed(() => ({
    left: `${contextMenuX.value}px`,
    top: `${contextMenuY.value}px`,
  }))

  function showContextMenu(event: MouseEvent) {
    const node = getNode()
    event.preventDefault()
    event.stopPropagation()
    actions.select(node.id)
    contextMenuOpen.value = false
    contextMenuX.value = event.clientX
    contextMenuY.value = event.clientY
    nextTick(() => {
      contextMenuOpen.value = true
    })
  }

  function handleContextMenuClick({ key }: { key: number | string }) {
    const menuKey = String(key)
    const node = getNode()
    actions.select(node.id)
    if (!isContextMenuKey(menuKey)) return

    switch (menuKey) {
      case 'select':
        return
      case 'add-approver':
        actions.addAfter(node.id, 'approver')
        return
      case 'add-condition':
        actions.addAfter(node.id, 'condition')
        return
      case 'add-cc':
        actions.addAfter(node.id, 'cc')
        return
      case 'move-up':
        if (!node.required) actions.move(node.id, -1)
        return
      case 'move-down':
        if (!node.required) actions.move(node.id, 1)
        return
      case 'duplicate':
        if (!node.required) actions.duplicate(node.id)
        return
      case 'remove':
        if (!node.required) actions.remove(node.id)
    }
  }

  return {
    contextMenuAnchorStyle,
    contextMenuItems,
    contextMenuOpen,
    handleContextMenuClick,
    showContextMenu,
  }
}
