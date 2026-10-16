<script setup lang="ts">
import { h } from 'vue'
import { Icon } from '@/components'
import type { VNode } from 'vue'
import type {
  WorkflowContextActionKey,
  WorkflowContextMenuAction,
  WorkflowContextMenuState,
} from '../types'

interface ContextMenuItem {
  key: string
  label: string
  icon: () => VNode
  children?: ContextMenuItem[]
  danger?: boolean
  disabled?: boolean
}

const props = defineProps<{
  actions: WorkflowContextMenuAction[]
  menu: WorkflowContextMenuState
}>()

const emit = defineEmits<{
  action: [key: WorkflowContextActionKey]
  close: []
}>()

const anchorStyle = computed(() => ({
  left: `${props.menu.x}px`,
  top: `${props.menu.y}px`,
}))

function renderMenuIcon(name: string) {
  return () =>
    h(
      'span',
      { class: 'inline-flex size-16 items-center justify-center align-middle' },
      [h(Icon, { name, size: 15 })]
    )
}

function toMenuItem(action: WorkflowContextMenuAction): ContextMenuItem {
  return {
    key: action.key,
    label: action.label,
    icon: renderMenuIcon(action.icon),
    children: action.children?.length
      ? action.children.map((child) => toMenuItem(child))
      : undefined,
    danger: action.danger,
    disabled: action.disabled,
  }
}

const menuItems = computed(() =>
  props.actions.map((action) => toMenuItem(action))
)

function findAction(
  actions: WorkflowContextMenuAction[],
  key: string
): WorkflowContextMenuAction | undefined {
  for (const action of actions) {
    if (action.key === key) return action
    const child = action.children ? findAction(action.children, key) : undefined
    if (child) return child
  }
  return undefined
}

function handleMenuClick({ key }: { key: number | string }) {
  const action = findAction(props.actions, String(key))
  if (action && !action.disabled) emit('action', action.key)
}

function handleOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<template>
  <a-dropdown
    :open="menu.open"
    :trigger="['click']"
    :menu="{ items: menuItems, selectable: false }"
    :classes="{ root: 'workflow-context-menu' }"
    destroy-on-hidden
    placement="bottomLeft"
    @menu-click="handleMenuClick"
    @open-change="handleOpenChange"
  >
    <span
      class="pointer-events-none fixed size-0"
      :style="anchorStyle"
      data-workflow-context-menu-anchor
    />
  </a-dropdown>
</template>

<style lang="less">
// 下拉菜单通过 Teleport 渲染到 body，需使用非 scoped 样式
.workflow-context-menu {
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    align-items: center;
  }

  .ant-dropdown-menu-item-icon,
  .ant-dropdown-menu-title-content {
    display: inline-flex;
    align-items: center;
  }
}
</style>
