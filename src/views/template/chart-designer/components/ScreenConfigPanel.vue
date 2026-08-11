<script setup lang="ts">
import { computed } from 'vue'
import type {
  ChartPreviewMode,
  ChartScreenConfig,
  ChartScreenTheme,
} from '../types'

const props = defineProps<{
  screenConfig: ChartScreenConfig
}>()

const emit = defineEmits<{
  updateScreen: [patch: Partial<ChartScreenConfig>]
}>()

const themes: { label: string; value: ChartScreenTheme }[] = [
  { label: '深空蓝', value: 'midnight' },
  { label: '浅色驾驶舱', value: 'light' },
  { label: '监控绿', value: 'matrix' },
]

const previewModes: { label: string; value: ChartPreviewMode }[] = [
  { label: '白天', value: 'light' },
  { label: '黑夜', value: 'dark' },
]
const themeValues = new Set<string>(themes.map((theme) => theme.value))

const previewModeValue = computed({
  get: () => props.screenConfig.previewMode,
  set: (previewMode: ChartPreviewMode) => emit('updateScreen', { previewMode }),
})

const canvasBackgroundValue = computed({
  get: () => props.screenConfig.canvasBackground,
  set: (canvasBackground: string) => emit('updateScreen', { canvasBackground }),
})

function updateText(key: 'subtitle' | 'title') {
  return (event: Event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    emit('updateScreen', { [key]: target.value })
  }
}

function updateTheme(value: string | number) {
  const theme = String(value)
  if (!isScreenTheme(theme)) return

  emit('updateScreen', { theme })
}

function isScreenTheme(value: string): value is ChartScreenTheme {
  return themeValues.has(value)
}
</script>

<template>
  <div class="grid gap-10">
    <label class="block text-12px text-secondary">
      大屏标题
      <input
        class="mt-5 h-32 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
        :value="screenConfig.title"
        @input="updateText('title')"
      />
    </label>
    <label class="block text-12px text-secondary">
      说明
      <input
        class="mt-5 h-32 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
        :value="screenConfig.subtitle"
        @input="updateText('subtitle')"
      />
    </label>
    <label class="block text-12px text-secondary">
      主题
      <a-select
        class="mt-5 w-full"
        size="small"
        :value="screenConfig.theme"
        :options="themes"
        @change="updateTheme"
      />
    </label>
    <div class="block text-12px text-secondary">
      预览模式
      <a-radio-group
        v-model:value="previewModeValue"
        class="mt-5 w-full whitespace-nowrap"
      >
        <a-radio-button
          v-for="mode in previewModes"
          :key="mode.value"
          :value="mode.value"
        >
          {{ mode.label }}
        </a-radio-button>
      </a-radio-group>
    </div>
    <div
      class="flex items-center justify-between gap-10 text-12px text-secondary"
    >
      <span>画布背景</span>
      <a-color-picker
        v-model:value="canvasBackgroundValue"
        value-format="hex"
      />
    </div>
  </div>
</template>
