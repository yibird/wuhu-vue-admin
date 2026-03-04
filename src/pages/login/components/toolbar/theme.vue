<template>
  <button
    class="flex size-40 cursor-pointer items-center justify-center rounded-8 transition hover:bg-[#f5f5f5]"
    type="button"
    @click="toggleThemeMode"
  >
    <Icon v-if="themeMode === ThemeMode.Dark" name="i-lucide:sun" :size="22" />
    <Icon v-else name="i-lucide:moon" :size="22" />
  </button>
</template>
<script setup lang="ts">
import { useTheme } from '@/composables'
import { ThemeMode } from '@/constant'

const { themeMode, toggleThemeMode } = useTheme()
</script>
