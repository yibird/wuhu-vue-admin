<template>
  <button
    type="button"
    class="w-layout-toolbar-item"
    data-testid="theme-toggle"
    data-motion="spin"
    @click="changeThemeMode"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition-[opacity,transform] duration-motion-base ease-motion-enter motion-reduce:transition-none"
      enter-from-class="scale-70 rotate-12 opacity-0 motion-reduce:(scale-100 rotate-0)"
      leave-active-class="transition-[opacity,transform] duration-motion-fast ease-motion-exit motion-reduce:transition-none"
      leave-to-class="scale-70 -rotate-12 opacity-0 motion-reduce:(scale-100 rotate-0)"
    >
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
