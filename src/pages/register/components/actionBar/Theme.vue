<template>
  <button
    :aria-label="$t('common.auth.theme')"
    class="size-36 flex cursor-pointer items-center justify-center rounded-8 border-0 bg-transparent text-main outline-none transition-[background-color,color,transform,box-shadow] duration-motion-base hover:(bg-hover text-primary -translate-y-1) focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] active:translate-y-0 motion-reduce:(transform-none transition-none)"
    type="button"
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
        :size="21"
      />
      <Icon v-else key="dark" name="i-lucide:moon" :size="21" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { ThemeMode } from '@/constants'
import { useTheme } from '@/composables'

const { themeMode, changeThemeWithAnimation } = useTheme()

const changeThemeMode = (event: Event) => {
  changeThemeWithAnimation(
    event,
    themeMode.value === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
  )
}
</script>
