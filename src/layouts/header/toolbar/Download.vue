<template>
  <a-tooltip title="下载中心">
    <a-badge
      :count="totalDownloadCount"
      :offset="[-5, 5]"
      :overflow-count="99"
      size="small"
    >
      <button
        type="button"
        :aria-label="`打开下载中心，当前 ${totalDownloadCount} 个下载`"
        class="w-layout-toolbar-item max-sm:hidden"
        data-motion="drop"
        @click="show = true"
      >
        <Icon name="i-lucide:download" :size="20" />
      </button>
    </a-badge>
  </a-tooltip>
  <DownloadCenter v-model:show="show" />
</template>
<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import { useDownloadCenter } from '@/layouts/config/downloadCenter/composables/useDownloadCenter'

const show = ref(false)
const DownloadCenter = defineAsyncComponent(
  () => import('@/layouts/config/downloadCenter/index.vue')
)
const { totalDownloadCount } = useDownloadCenter()
</script>
