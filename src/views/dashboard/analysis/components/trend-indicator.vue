<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * @desc 环比文案,负值以 - 开头
     */
    change: string
    /**
     * @desc 图标尺寸
     * @default 13
     */
    size?: number
  }>(),
  { size: 13 }
)

const isDown = computed(() => props.change.startsWith('-'))
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center gap-3 text-xs font-700 tabular-nums"
    :class="isDown ? 'text-warning' : 'text-success'"
  >
    <Icon
      :name="isDown ? 'i-lucide:trending-down' : 'i-lucide:trending-up'"
      :size="size"
    />
    {{ change }}
  </span>
</template>
