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
  <ChatModal v-model:show="show" />
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const ChatModal = defineAsyncComponent(
  () => import('@/layouts/config/chatModal/index.vue')
)
const show = ref(false)
</script>
