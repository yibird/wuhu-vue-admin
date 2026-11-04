<template>
  <ChartInstance v-bind="$attrs" />
</template>

<script lang="ts" setup>
import ChartInstance from './instance.vue'
import { useECharts } from './hooks/useECharts'

defineOptions({
  inheritAttrs: false,
})

useECharts()
</script>
