<template>
  <button
    type="button"
    class="w-layout-toolbar-item"
    data-testid="theme-toggle"
    data-motion="spin"
    @click="toggleThemeWithAnimation"
  >
    <Transition name="fade-icon" mode="out-in">
      <Icon
        v-if="themeMode === THEME_MODE.Dark"
        key="light"
        name="i-lucide:sun"
        :size="22"
      />
      <Icon v-else key="dark" name="i-lucide:moon" :size="22" />
    </Transition>
  </button>
</template>
<script setup lang="ts">
import { useTheme } from '@/theme'
import { THEME_MODE } from '@/constants'

const { themeMode, toggleThemeWithAnimation } = useTheme()
</script>
