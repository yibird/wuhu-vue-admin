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
      <Suspense timeout="0">
        <NoticeCenter />
        <template #fallback>
          <div class="w-320 px-10 py-14">
            <a-skeleton active :paragraph="{ rows: 4 }" />
          </div>
        </template>
      </Suspense>
    </template>
  </a-popover>
</template>
<script lang="ts" setup>
import { NoticeCenter } from '@/layouts/config'

defineOptions({ name: 'Notice' })
</script>
