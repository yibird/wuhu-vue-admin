<template>
  <a-popover trigger="click" placement="bottomRight">
    <span class="size-32 inline-flex shrink-0">
      <button
        type="button"
        aria-label="打开通知中心"
        class="w-layout-toolbar-item"
        data-motion="ring"
      >
        <a-badge dot>
          <Icon name="i-lucide:bell" :size="20" />
        </a-badge>
      </button>
    </span>
    <template #content>
      <NoticeCenter />
    </template>
  </a-popover>
</template>
<script lang="ts" setup>
const NoticeCenter = defineAsyncComponent(
  () => import('@/layouts/config/noticeCenter/index.vue')
)
</script>
