<template>
  <button
    :aria-label="$t('common.auth.theme')"
    class="size-36 flex cursor-pointer items-center justify-center rounded-8 border-0 bg-transparent text-main outline-none transition-[background-color,color,transform,box-shadow] duration-200 hover:(bg-hover text-primary -translate-y-1) focus-visible:(ring-2 ring-primary/24) active:translate-y-0 motion-reduce:(transform-none transition-none)"
    type="button"
    @click="toggleThemeWithAnimation"
  >
    <Transition name="fade-icon" mode="out-in">
      <Icon
        v-if="themeMode === THEME_MODE.Dark"
        key="light"
        name="i-lucide:sun"
        :size="21"
      />
      <Icon v-else key="dark" name="i-lucide:moon" :size="21" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { THEME_MODE } from '@/constants'
import { useTheme } from '@/theme'

const { themeMode, toggleThemeWithAnimation } = useTheme()
</script>
