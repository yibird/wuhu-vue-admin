<template>
  <a-dropdown
    :menu="{ items: options }"
    placement="bottomRight"
    @menu-click="handleMenuClick"
  >
    <button
      type="button"
      class="size-28 grid-center rounded-4 text-secondary cursor-pointer transition-colors hover:(bg-white text-main)"
      title="更多操作"
      @click.stop
    >
      <Icon name="i-lucide:ellipsis" :size="17" />
    </button>
  </a-dropdown>
</template>

<script setup lang="ts">
import type { DropdownEmits, DropdownProps } from './types'

const props = defineProps<DropdownProps>()
const emits = defineEmits<DropdownEmits>()

const options = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
]

function handleMenuClick({ key }: { key: string }) {
  if (key === 'edit') {
    emits('edit', props.item)
    return
  }

  emits('delete', props.item)
}
</script>
