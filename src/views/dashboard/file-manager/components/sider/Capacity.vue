<script lang="ts" setup>
import { Icon } from '@/components/icon'
import { formatFileSize } from '../utils'

const props = defineProps<{
  usedSize: number
  totalSize: number
}>()

const percent = computed(() => {
  if (props.totalSize <= 0) return 0
  return Math.min(props.usedSize / props.totalSize, 1)
})

const usageRatio = computed(() => {
  if (props.totalSize <= 0) return 0
  return props.usedSize / props.totalSize
})
const percentText = computed(() => `${Math.round(usageRatio.value * 100)}%`)
const isOverLimit = computed(() => props.usedSize > props.totalSize)
const progressColor = computed(() =>
  isOverLimit.value
    ? 'rgb(var(--w-color-error))'
    : 'rgb(var(--w-color-primary))'
)
</script>

<template>
  <div
    class="border-t-1 border-t-solid border-color-1 px-16 py-14 transition-colors duration-motion-base ease-motion-standard motion-reduce:transition-none max-[1199px]:(border-t-0 border-l-1 border-l-solid border-color-1 px-16 py-12) max-[767px]:(border-t-1 border-l-0 border-t-solid border-color-1 px-12 py-12)"
  >
    <div class="flex items-center justify-between gap-8">
      <div class="flex min-w-0 items-center gap-8">
        <Icon
          name="i-lucide:database"
          :size="16"
          class="text-secondary max-[575px]:hidden"
        />
        <span class="whitespace-nowrap text-xs text-secondary">存储空间</span>
      </div>
      <span
        class="text-sm text-main font-600"
        :class="isOverLimit ? 'text-error' : ''"
      >
        {{ percentText }}
      </span>
    </div>
    <div class="mt-10 h-6 overflow-hidden rounded-full bg-fill-quaternary">
      <div
        class="h-full rounded-full transition-[width,background-color] duration-motion-slower ease-motion-enter"
        :style="{
          width: `${percent * 100}%`,
          backgroundColor: progressColor,
        }"
      ></div>
    </div>
    <div class="mt-8 flex items-center justify-between gap-8 text-11px">
      <span class="text-main">{{ formatFileSize(usedSize) }} 已使用</span>
      <span class="text-secondary">共 {{ formatFileSize(totalSize) }}</span>
    </div>
    <div v-if="isOverLimit" class="mt-6 text-11px text-error">
      已超出可用空间
    </div>
  </div>
</template>
