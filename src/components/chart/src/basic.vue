<template>
  <ChartInstance v-bind="$attrs" />
</template>

<script lang="ts" setup>
import ChartInstance from './instance.vue'
import { useBasicECharts } from './hooks/useBasicECharts'

defineOptions({
  inheritAttrs: false,
})

useBasicECharts()
</script>
