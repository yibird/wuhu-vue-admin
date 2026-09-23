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
  <DownloadCenter v-if="loaded" v-model:show="show" />
</template>
<script lang="ts" setup>
import { DownloadCenter } from '@/layouts/config'
import type { WatchStopHandle } from 'vue'

const show = ref(false)
const loaded = ref(false)
const totalDownloadCount = shallowRef(0)

let stopCountWatch: WatchStopHandle | undefined

// 首次打开后再加载 composable，避免 downloadCenter 数据进入首屏 chunk
watch(show, async (value) => {
  if (!value || loaded.value) return

  loaded.value = true
  const { useDownloadCenter } =
    await import('@/layouts/config/download-center/hooks')
  const { totalDownloadCount: count } = useDownloadCenter()
  stopCountWatch = watch(
    count,
    (value) => {
      totalDownloadCount.value = value
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  stopCountWatch?.()
})
</script>
