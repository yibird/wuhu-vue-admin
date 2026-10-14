<template>
  <a-tooltip placement="bottom">
    <template #trigger>
      <button class="toolbar-item" @click="onClick">
        <Icon name="i-lucide:rotate-ccw" :size="16" />
      </button>
    </template>
    <span>刷新</span>
  </a-tooltip>
</template>
<script lang="ts" setup>
import { useTablePlusInject } from '../../context'

defineOptions({ name: 'Refresh' })

const { emits } = useTablePlusInject()
const onClick = () => {
  emits('refresh')
}
</script>
