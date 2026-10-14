<template>
  <a-tooltip placement="bottom">
    <template #trigger>
      <button class="toolbar-item" @click="fullScreen = !fullScreen">
        <Icon
          :name="fullScreen ? 'i-lucide:minimize' : 'i-lucide:maximize'"
          :size="16"
        />
      </button>
    </template>
    <span>全屏</span>
  </a-tooltip>
</template>
<script lang="ts" setup>
import { useTablePlusInject } from '../../context'

defineOptions({ name: 'Fullscreen' })
const { fullScreen } = useTablePlusInject()
</script>
