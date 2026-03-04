<template>
  <div class="h-50 px-20 flex items-center justify-center gap-10">
    <img :src="logo" class="size-32 select-none pointer-events-none" />
    <span v-if="!collapsed" class="text-base font-bold truncate">{{ name }}</span>
  </div>
</template>
<script lang="ts" setup>
  import { appStore } from '@/store'
  import { storeToRefs } from 'pinia'
  import type { LogoProps } from './types'

  const { app } = storeToRefs(appStore())
  const { collapsed = false } = defineProps<LogoProps>()

  const { name, logo } = app.value
</script>
