<script setup lang="ts">
import { CHART_DESIGNER_SELECTORS } from '../../constants'
import { chartControlDefinitions, isChartType } from './registry'
import type { ChartDataSource, ChartField, ChartWidget } from '../../types'

const props = defineProps<{
  dataSources: readonly ChartDataSource[]
  fields: readonly ChartField[]
  widget: ChartWidget
}>()

const emit = defineEmits<{
  duplicateWidget: [id: string]
  removeWidget: [id: string]
  updateWidget: [id: string, patch: Partial<ChartWidget>]
}>()

const numberFields = computed(() =>
  props.fields.filter((field) =>
    ['currency', 'number', 'percent'].includes(field.type)
  )
)
const dimensionFields = computed(() =>
  props.fields.filter((field) => ['date', 'string'].includes(field.type))
)
const chartTypes = computed(() =>
  chartControlDefinitions
    .filter((item) => item.kind === 'chart' && isChartType(item.type))
    .map((item) => ({ label: item.title, value: item.type }))
)
const dataSourceOptions = computed(() =>
  props.dataSources.map((source) => ({ label: source.name, value: source.id }))
)
const dimensionFieldOptions = computed(() =>
  dimensionFields.value.map((field) => ({
    label: field.label,
    value: field.key,
  }))
)
const numberFieldOptions = computed(() =>
  numberFields.value.map((field) => ({ label: field.label, value: field.key }))
)

function updateWidget(patch: Partial<ChartWidget>) {
  emit('updateWidget', props.widget.id, patch)
}

function updateText(
  key: 'dimension' | 'insight' | 'measure' | 'sourceId' | 'title'
) {
  return (event: Event) => {
    const target = event.target
    if (
      !(
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      )
    )
      return
    updateWidget({ [key]: target.value })
  }
}

function updateNumber(key: 'colSpan' | 'rowSpan') {
  return (event: Event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    updateWidget({ [key]: Number(target.value) })
  }
}

function updateChartType(value: string | number) {
  const nextType = String(value)
  if (!isChartType(nextType)) return

  updateWidget({ chartType: nextType })
}

function updateTextValue(
  key: 'dimension' | 'measure' | 'sourceId',
  value: string | number
) {
  updateWidget({ [key]: String(value) })
}

function updateAccent(value: unknown) {
  if (typeof value !== 'string') return

  updateWidget({ accent: value })
}
</script>

<template>
  <div>
    <div class="mb-10 flex items-center justify-between gap-8">
      <strong class="text-13px text-primary">选中控件</strong>
      <div class="flex gap-6">
        <a-button
          class="chart-widget-config-icon-button"
          size="small"
          @click="emit('duplicateWidget', widget.id)"
        >
          <template #icon>
            <Icon name="i-lucide:copy" :size="14" />
          </template>
        </a-button>
        <a-button
          danger
          class="chart-widget-config-icon-button"
          size="small"
          @click="emit('removeWidget', widget.id)"
        >
          <template #icon>
            <Icon name="i-lucide:trash-2" :size="14" />
          </template>
        </a-button>
      </div>
    </div>

    <div class="grid gap-10">
      <label class="block text-12px text-secondary">
        标题
        <input
          class="mt-5 h-32 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
          :value="widget.title"
          @input="updateText('title')"
        />
      </label>

      <label class="block text-12px text-secondary">
        数据源
        <a-select
          class="mt-5 w-full"
          size="small"
          :data-testid="CHART_DESIGNER_SELECTORS.dataSourceSelect"
          :value="widget.sourceId"
          :options="dataSourceOptions"
          @change="
            (value: string | number) => updateTextValue('sourceId', value)
          "
        />
      </label>

      <label
        v-if="widget.kind === 'chart'"
        class="block text-12px text-secondary"
      >
        图表类型
        <a-select
          class="mt-5 w-full"
          size="small"
          :value="widget.chartType"
          :options="chartTypes"
          @change="updateChartType"
        />
      </label>

      <div class="grid grid-cols-2 gap-8">
        <label class="block text-12px text-secondary">
          维度
          <a-select
            class="mt-5 w-full"
            size="small"
            :value="widget.dimension"
            :options="dimensionFieldOptions"
            @change="
              (value: string | number) => updateTextValue('dimension', value)
            "
          />
        </label>
        <label class="block text-12px text-secondary">
          指标
          <a-select
            class="mt-5 w-full"
            size="small"
            :value="widget.measure"
            :options="numberFieldOptions"
            @change="
              (value: string | number) => updateTextValue('measure', value)
            "
          />
        </label>
      </div>

      <div class="grid grid-cols-[1fr_1fr_auto] items-end gap-8">
        <label class="block text-12px text-secondary">
          列宽
          <input
            class="mt-5 h-32 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
            max="12"
            min="2"
            type="number"
            :value="widget.colSpan"
            @input="updateNumber('colSpan')"
          />
        </label>
        <label class="block text-12px text-secondary">
          行高
          <input
            class="mt-5 h-32 w-full rounded-6 border-1 border-color-2 border-solid bg-fill px-8 text-13px text-primary outline-none focus:border-primary"
            max="4"
            min="1"
            type="number"
            :value="widget.rowSpan"
            @input="updateNumber('rowSpan')"
          />
        </label>
        <a-color-picker
          :value="widget.accent"
          value-format="hex"
          @change="updateAccent"
        />
      </div>

      <label class="block text-12px text-secondary">
        洞察说明
        <textarea
          class="mt-5 h-96 w-full resize-none rounded-6 border-1 border-color-2 border-solid bg-fill px-8 py-7 text-13px text-primary outline-none focus:border-primary"
          :value="widget.insight"
          @input="updateText('insight')"
        ></textarea>
      </label>
    </div>
  </div>
</template>

<style scoped>
.chart-widget-config-icon-button {
  width: 28px;
  padding-inline: 0;
}
</style>
