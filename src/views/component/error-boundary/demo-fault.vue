<script setup lang="ts">
import { Icon } from '@/components'

const props = defineProps<{
  active: boolean
}>()

const status = computed(() => {
  if (props.active) {
    throw new Error('Component Demo 主动触发的渲染异常')
  }
  return '子组件运行正常'
})
</script>

<template>
  <div
    class="h-120 flex flex-col items-center justify-center gap-8 rounded-6 border-1 border-success border-solid bg-success/5"
  >
    <Icon name="i-lucide:circle-check" :size="24" class="text-success" />
    <span class="text-sm text-main">{{ status }}</span>
  </div>
</template>
