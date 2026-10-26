<template>
  <div>
    <a-divider>主题模式</a-divider>
    <div class="grid grid-cols-3 gap-10">
      <button
        v-for="item in themeModeOptions"
        :key="item.value"
        type="button"
        class="group min-w-0 cursor-pointer border-0 bg-transparent p-0 text-main outline-none"
        :aria-label="`切换${item.label}主题`"
        :aria-pressed="appThemeMode === item.value"
        @click="changeThemeMode(item.value)"
      >
        <span
          :class="[
            'relative box-border block h-80 w-full overflow-hidden rounded-7 border-2 border-solid bg-container shadow-md shadow-ink/20 transition-[transform,box-shadow] duration-200 ease-[var(--w-motion-ease-enter)] group-hover:(-translate-y-1 shadow-xl shadow-ink/20) group-focus-visible:(ring-2 ring-primary/24) group-active:translate-y-0 motion-reduce:(transform-none transition-none)',
            appThemeMode === item.value
              ? 'border-primary shadow-lg shadow-primary/15'
              : 'border-muted',
          ]"
        >
          <img
            :src="item.img"
            :alt="`${item.label}主题预览`"
            class="h-full w-full pointer-events-none select-none object-cover"
            draggable="false"
          />
          <span
            v-if="appThemeMode === item.value"
            class="absolute right-5 top-5 size-18 flex items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary/28"
          >
            <Icon name="i-lucide:check" :size="14" />
          </span>
        </span>
        <span
          :class="[
            'mt-8 block truncate text-center text-sm font-600 transition-colors duration-200 motion-reduce:transition-none',
            appThemeMode === item.value
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
import { useTheme } from '@/theme'
import { themeModeOptions } from '@/config'

const { appThemeMode, changeThemeMode } = useTheme()
</script>
