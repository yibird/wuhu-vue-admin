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
            'relative box-border block h-60 w-full overflow-hidden rounded-7 border-2 border-solid bg-container shadow-md shadow-ink/20 transition-[transform,border-color,box-shadow] duration-200 ease-[var(--w-motion-ease-enter)] group-hover:(-translate-y-1 shadow-xl shadow-ink/20) group-focus-visible:(ring-2 ring-primary/24) group-active:translate-y-0 motion-reduce:(transform-none transition-none)',
            app.menuMode === item.value
              ? 'border-primary shadow-lg shadow-primary/15'
              : 'border-muted',
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
            class="absolute right-5 top-5 size-18 flex items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary/28"
          >
            <Icon name="i-lucide:check" :size="12" />
          </span>
        </span>
        <span
          :class="[
            'mt-8 block truncate text-center text-sm font-600 transition-colors duration-200 motion-reduce:transition-none',
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
import { menuModeOptions } from '@/config'
import type { MenuMode } from '@/constants'

const { app } = useAppStore()

const onClick = (mode: MenuMode) => {
  app.value.menuMode = mode
}
</script>
