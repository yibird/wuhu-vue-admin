<script lang="ts" setup>
import { Loading } from '@/components/loading'

defineOptions({
  name: 'LockScreenLoadingCover',
})
</script>

<template>
  <!-- 锁屏 chunk 加载期间的即时遮罩:避免等待期间桌面内容仍然可见 -->
  <Loading full description="正在锁定工作区…" />
</template>
