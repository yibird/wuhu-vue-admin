<script setup lang="ts">
import type {
  ChartDataSource,
  ChartPreviewMode,
  ChartScreenConfig,
  ChartScreenTheme,
} from '../types'

const props = defineProps<{
  activeSourceId: string
  dataSources: readonly ChartDataSource[]
  screenConfig: ChartScreenConfig
}>()

const emit = defineEmits<{
  openDataSource: []
  selectSource: [id: string]
  updateScreen: [patch: Partial<ChartScreenConfig>]
}>()

const themes: { label: string; value: ChartScreenTheme }[] = [
  { label: '深空蓝', value: 'midnight' },
  { label: '浅色', value: 'light' },
  { label: '监控绿', value: 'matrix' },
]

const previewModes: { label: string; value: ChartPreviewMode }[] = [
  { label: '白天', value: 'light' },
  { label: '黑夜', value: 'dark' },
]
const dataSourceOptions = computed(() =>
  props.dataSources.map((source) => ({
    label: source.name,
    value: source.id,
  }))
)

const previewModeValue = computed({
  get: () => props.screenConfig.previewMode,
  set: (previewMode: ChartPreviewMode) => emit('updateScreen', { previewMode }),
})

const canvasBackgroundValue = computed({
  get: () => props.screenConfig.canvasBackground,
  set: (canvasBackground: string) => emit('updateScreen', { canvasBackground }),
})

function updateSource(value: string | number) {
  emit('selectSource', String(value))
}

function updateTheme(value: string | number) {
  const theme = String(value) as ChartScreenTheme
  if (themes.some((item) => item.value === theme))
    emit('updateScreen', { theme })
}
</script>

<template>
  <div class="min-w-0 flex flex-wrap items-center justify-end gap-8">
    <div class="h-32 flex items-center gap-6 rounded-7 bg-fill px-8">
      <Icon name="i-lucide:database" :size="14" class="text-tertiary" />
      <a-select
        class="w-148"
        size="small"
        :value="activeSourceId"
        :options="dataSourceOptions"
        @change="updateSource"
      />
      <a-button
        class="chart-toolbar-icon-button"
        size="small"
        title="数据源管理"
        @click="emit('openDataSource')"
      >
        <template #icon>
          <Icon name="i-lucide:settings-2" :size="14" />
        </template>
      </a-button>
    </div>

    <a-select
      class="w-108"
      size="small"
      :value="screenConfig.theme"
      :options="themes"
      @change="updateTheme"
    />

    <a-radio-group v-model:value="previewModeValue" size="small">
      <a-radio-button
        v-for="mode in previewModes"
        :key="mode.value"
        :value="mode.value"
      >
        {{ mode.label }}
      </a-radio-button>
    </a-radio-group>

    <a-color-picker v-model:value="canvasBackgroundValue" value-format="hex" />
  </div>
</template>

<style scoped>
.chart-toolbar-icon-button {
  width: 24px;
  padding-inline: 0;
}
</style>
