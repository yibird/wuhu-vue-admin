<script setup lang="ts">
import type {
  ChartDataSource,
  ChartScreenConfig,
  ChartWidget,
} from '../../types'
import Preview from '../Preview.vue'

defineProps<{
  source?: ChartDataSource
  screenConfig: ChartScreenConfig
  widget: ChartWidget
}>()
</script>

<template>
  <Preview
    :data-chart-control-type="
      widget.kind === 'chart' ? widget.chartType : widget.kind
    "
    :preview-mode="screenConfig.previewMode"
    :source="source"
    :widget="widget"
  />
</template>
