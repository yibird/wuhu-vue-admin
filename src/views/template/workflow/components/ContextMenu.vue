<script setup lang="ts">
import { computed } from 'vue'
import { renderIcon } from '@/utils'
import type {
  WorkflowContextActionKey,
  WorkflowContextMenuAction,
  WorkflowContextMenuState,
} from '../types'

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

const menuItems = computed(() =>
  props.actions.map((action) => ({
    key: action.key,
    label: action.label,
    icon: renderIcon(action.icon, { size: 15 }),
    children: action.children?.map((child) => ({
      key: child.key,
      label: child.label,
      icon: renderIcon(child.icon, { size: 15 }),
      danger: child.danger,
      disabled: child.disabled,
    })),
    danger: action.danger,
    disabled: action.disabled,
  }))
)

function handleMenuClick({ key }: { key: number | string }) {
  const action = props.actions
    .flatMap((item) => [item, ...(item.children ?? [])])
    .find((item) => item.key === String(key))
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
