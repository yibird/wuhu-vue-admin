<template>
  <div>
    <a-divider>菜单模式</a-divider>
    <div class="grid grid-cols-4 gap-6">
      <button
        v-for="item in menuModeOptions"
        :key="item.value"
        type="button"
        class="group min-w-0 cursor-pointer border-0 bg-transparent p-0 text-main outline-none"
        :aria-label="`切换${item.label}菜单模式`"
        :aria-pressed="app.menuMode === item.value"
        @click="onClick(item.value)"
      >
        <span
          :class="[
            'relative box-border block h-60 w-full overflow-hidden rounded-7 border-2 border-solid bg-container shadow-[0_4px_12px_rgb(var(--w-shadow-color-1))] transition-[transform,border-color,box-shadow] duration-motion-base ease-motion-enter group-hover:(-translate-y-1 shadow-[0_8px_20px_rgb(var(--w-shadow-color-1))]) group-focus-visible:shadow-[0_0_0_2px_rgb(var(--w-color-primary)_/_24%)] group-active:translate-y-0 motion-reduce:(transform-none transition-none)',
            app.menuMode === item.value
              ? 'border-primary shadow-[0_6px_18px_rgb(var(--w-color-primary)_/_15%)]'
              : 'border-color-1',
          ]"
        >
          <img
            :src="item.img"
            :alt="`${item.label}菜单预览`"
            class="h-full w-full pointer-events-none select-none object-cover"
            draggable="false"
          />
          <span
            v-if="app.menuMode === item.value"
            class="absolute right-5 top-5 size-18 flex items-center justify-center rounded-full bg-primary text-white shadow-[0_3px_8px_rgb(var(--w-color-primary)_/_28%)]"
          >
            <Icon name="i-lucide:check" :size="12" />
          </span>
        </span>
        <span
          :class="[
            'mt-8 block truncate text-center text-sm font-600 transition-colors duration-motion-base motion-reduce:transition-none',
            app.menuMode === item.value
              ? 'text-primary'
              : 'text-secondary group-hover:text-main',
          ]"
        >
          {{ item.label }}
        </span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'
import { menuModeOptions, type MenuMode } from '@/config'

const { app } = useAppStore()

const onClick = (mode: MenuMode) => {
  app.value.menuMode = mode
}
</script>
