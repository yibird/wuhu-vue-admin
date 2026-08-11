<script lang="ts" setup>
import { useAppStore } from '@/store'
import type { LogoProps } from './types'

const { app, sider } = useAppStore()
const { collapsed = false } = defineProps<LogoProps>()
</script>

<template>
  <div
    v-if="sider.showLogo"
    class="group h-50 flex items-center justify-center gap-10 px-10"
  >
    <img
      :src="app.logo"
      :alt="`${app.name} Logo`"
      class="size-30 pointer-events-none origin-center select-none will-change-transform transition-[transform,filter] duration-300 ease-out [filter:drop-shadow(0_3px_5px_rgb(15_23_42_/_14%))] group-hover:(-translate-y-1 rotate-2 scale-105 [filter:drop-shadow(0_6px_8px_rgb(15_23_42_/_20%))]) motion-reduce:transition-none motion-reduce:group-hover:transform-none"
      draggable="false"
    />
    <span
      v-show="!collapsed"
      class="truncate text-base font-700 tracking-0 transition-colors duration-200 group-hover:text-primary motion-reduce:transition-none"
    >
      {{ app.name }}
    </span>
  </div>
</template>
