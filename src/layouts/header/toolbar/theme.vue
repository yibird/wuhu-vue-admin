<template>
  <button @click="changeThemeMode" class="relative">
    <Icon v-if="themeMode === ThemeMode.Dark" name="i-lucide:sun" :size="22" />
    <Icon v-else name="i-lucide:moon" :size="22" />
  </button>
</template>
<script setup lang="ts">
import { useTheme } from '@/theme'
import { ThemeMode } from '@/constant'

const { themeMode, changeThemeWithAnimation } = useTheme()

const changeThemeMode = (e: Event) => {
  const mode =
    themeMode.value === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
  changeThemeWithAnimation(e, mode)
}
</script>
