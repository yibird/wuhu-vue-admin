<template>
  <a-popover trigger="click" placement="bottomRight">
    <button type="button" class="w-layout-toolbar-item" data-motion="ring">
      <a-badge dot>
        <Icon name="i-lucide:bell" :size="20" />
      </a-badge>
    </button>
    <template #content>
      <NoticeCenter />
    </template>
  </a-popover>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const NoticeCenter = defineAsyncComponent(
  () => import('@/layouts/config/noticeCenter/index.vue')
)
</script>
