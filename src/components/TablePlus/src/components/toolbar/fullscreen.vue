<template>
  <n-tooltip placement="bottom">
    <template #trigger>
      <button class="toolbar-item" @click="fullScreen = !fullScreen">
        <Icon :name="fullScreen ? 'i-lucide:minimize' : 'i-lucide:maximize'" :size="16" />
      </button>
    </template>
    <span>全屏</span>
  </n-tooltip>
</template>
<script lang="ts" setup>
  import { useTablePlusInject } from '../../context'
  const { fullScreen } = useTablePlusInject()
</script>
