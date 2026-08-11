<script setup lang="ts">
import { CHART_DESIGNER_SELECTORS } from '../constants'
import WidgetConfig from './controls/WidgetConfig.vue'
import type { ChartDataSource, ChartField, ChartWidget } from '../types'

defineProps<{
  dataSources: readonly ChartDataSource[]
  fields: readonly ChartField[]
  widget?: ChartWidget
}>()

defineEmits<{
  duplicateWidget: [id: string]
  removeWidget: [id: string]
  updateWidget: [id: string, patch: Partial<ChartWidget>]
}>()
</script>

<template>
  <section
    class="min-h-0 min-w-0 grid grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
    :data-testid="CHART_DESIGNER_SELECTORS.inspector"
  >
    <header class="border-b border-color-2 px-12 py-10">
      <h2 class="m-0 text-14px font-700 text-primary">属性面板</h2>
      <p class="m-0 mt-3 text-12px text-secondary">
        选中控件后编辑图表类型、字段和布局
      </p>
    </header>

    <Scrollbar class="min-h-0" content-class="p-12">
      <WidgetConfig
        v-if="widget"
        :data-sources="dataSources"
        :fields="fields"
        :widget="widget"
        @duplicate-widget="$emit('duplicateWidget', $event)"
        @remove-widget="$emit('removeWidget', $event)"
        @update-widget="(id, patch) => $emit('updateWidget', id, patch)"
      />

      <div
        v-else
        class="rounded-7 bg-fill p-14 text-center text-13px text-secondary"
      >
        选择画布上的控件后编辑图表类型、字段和布局。
      </div>
    </Scrollbar>
  </section>
</template>
