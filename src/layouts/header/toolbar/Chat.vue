<template>
  <a-tooltip title="AI 助手">
    <button
      type="button"
      aria-label="打开 AI 助手"
      class="w-layout-toolbar-item"
      data-motion="pulse"
      @click="show = true"
    >
      <Icon name="i-lucide:bot" :size="20" />
    </button>
  </a-tooltip>
  <ChatModal v-if="loaded" v-model:show="show" />
</template>
<script lang="ts" setup>
import { ChatModal } from '@/layouts/config'

const show = ref(false)
const loaded = ref(false)

// 首次打开后再挂载，避免 async chunk 在布局初始化时就被加载
watch(show, (value) => {
  if (value) loaded.value = true
})
</script>
