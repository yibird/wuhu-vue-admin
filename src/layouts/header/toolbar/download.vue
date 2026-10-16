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
import { message } from 'antdv-next'
import { DownloadCenter } from '@/layouts/config'
import type { WatchStopHandle } from 'vue'

const show = ref(false)
const loaded = ref(false)
const totalDownloadCount = shallowRef(0)

let stopCountWatch: WatchStopHandle | undefined
let disposed = false

/**
 * 加载下载中心 composable 并订阅徽标计数
 *
 * 首次渲染后即初始化一次,保证徽标在打开下载中心前就展示真实条数;
 * 通过动态 import 延迟加载,避免其数据进入首屏 chunk。
 */
async function loadDownloadCenter() {
  if (loaded.value) return

  loaded.value = true

  try {
    const { useDownloadCenter } =
      await import('@/layouts/config/download-center/hooks')
    // 组件卸载后不再创建 watcher,避免泄漏
    if (disposed) return

    const { totalDownloadCount: count } = useDownloadCenter()
    stopCountWatch = watch(
      count,
      (value) => {
        totalDownloadCount.value = value
      },
      { immediate: true }
    )
  } catch {
    loaded.value = false
    message.error('下载中心加载失败，请稍后重试')
  }
}

watch(show, (value) => {
  if (value) loadDownloadCenter()
})

onMounted(loadDownloadCenter)

onBeforeUnmount(() => {
  disposed = true
  stopCountWatch?.()
})
</script>
