<template>
  <button
    type="button"
    class="w-layout-toolbar-item"
    data-testid="theme-toggle"
    data-motion="spin"
    @click="changeThemeMode"
  >
    <Transition name="fade-icon" mode="out-in">
      <Icon
        v-if="themeMode === ThemeMode.Dark"
        key="light"
        name="i-lucide:sun"
        :size="22"
      />
      <Icon v-else key="dark" name="i-lucide:moon" :size="22" />
    </Transition>
  </button>
</template>
<script setup lang="ts">
import { useTheme } from '@/composables'
import { ThemeMode } from '@/constants'

const { themeMode, changeThemeWithAnimation } = useTheme()

const changeThemeMode = (e: Event) => {
  changeThemeWithAnimation(
    e,
    themeMode.value === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
  )
}
</script>
