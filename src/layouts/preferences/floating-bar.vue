<template>
  <aside
    v-show="!preferencesOpen"
    class="preferences-floating-bar fixed z-900 flex rounded-8 b-1-regular bg-container p-3 shadow-lg sm:hidden"
    aria-label="快捷工具"
  >
    <button
      type="button"
      class="size-42 flex cursor-pointer items-center justify-center rounded-6 border-0 bg-primary p-0 text-white outline-none transition-[box-shadow,transform] duration-200 ease-[var(--w-motion-ease-enter)] focus-visible:(ring-3 ring-primary/24) active:scale-92 motion-reduce:(transform-none transition-none)"
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

<script setup lang="ts">
import { usePreferences } from './hooks'

const { preferencesOpen, openPreferences } = usePreferences()
</script>

<style scoped>
.preferences-floating-bar {
  right: max(12px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom));
}
</style>
