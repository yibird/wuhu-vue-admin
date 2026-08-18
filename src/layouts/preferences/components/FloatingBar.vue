<script setup lang="ts">
import { usePreferences } from '../composables/usePreferences'

const { preferencesOpen, openPreferences } = usePreferences()
</script>

<template>
  <aside
    v-show="!preferencesOpen"
    class="preferences-floating-bar fixed z-900 flex rounded-8 border-1 border-color-2 border-solid bg-container p-3 shadow-all-lg sm:hidden"
    aria-label="快捷工具"
  >
    <button
      type="button"
      class="size-42 flex cursor-pointer items-center justify-center rounded-6 border-0 bg-primary p-0 text-white outline-none transition-[box-shadow,transform] duration-motion-base ease-motion-enter focus-visible:shadow-[0_0_0_3px_rgb(var(--w-color-primary)_/_24%)] active:scale-92 motion-reduce:(transform-none transition-none)"
      aria-label="打开项目设置"
      aria-haspopup="dialog"
      :aria-expanded="preferencesOpen"
      title="项目设置"
      @click="openPreferences"
    >
      <Icon name="i-lucide:settings-2" :size="20" />
    </button>
  </aside>
</template>

<style scoped>
.preferences-floating-bar {
  right: max(12px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom));
}
</style>
