<template>
  <VChart />
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts'
import { useECharts } from './hooks'

useECharts()
</script>
