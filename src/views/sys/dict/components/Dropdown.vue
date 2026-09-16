<script setup lang="ts">
import type { DropdownEmits, DropdownProps } from './types'

const props = defineProps<DropdownProps>()
const emit = defineEmits<DropdownEmits>()

const options = [
  { key: 'edit', label: '编辑' },
  { key: 'delete', label: '删除', danger: true },
]

function handleMenuClick({ key }: { key: string }) {
  if (key === 'edit') {
    emit('edit', props.item)
    return
  }

  emit('delete', props.item)
}
</script>

<template>
  <a-dropdown
    :menu="{ items: options }"
    placement="bottomRight"
    @menu-click="handleMenuClick"
  >
    <button
      type="button"
      class="size-28 grid-center rounded-4 text-secondary transition-colors hover:bg-hover hover:text-main"
      title="更多操作"
      @click.stop
    >
      <Icon name="i-lucide:ellipsis" :size="17" />
    </button>
  </a-dropdown>
</template>
