<template>
  <SectionPanel
    title="服务器监控"
    icon="i-lucide:server-cog"
    description="CPU、内存、磁盘和网络资源使用情况"
  >
    <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 2xl:grid-cols-4">
      <MetricCard v-for="item in resources" :key="item.id" :metric="item" />
    </div>
    <ResourceTrendChart :resources="resources" class="mt-12" />
    <div
      class="mt-12 grid grid-cols-1 gap-10 rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12 sm:grid-cols-2 xl:grid-cols-4"
    >
      <div v-for="item in serverDetails" :key="item.label" class="min-w-0">
        <div class="text-xs text-secondary">{{ item.label }}</div>
        <div class="mt-5 truncate text-sm text-main font-600">
          {{ item.value }}
        </div>
      </div>
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import MetricCard from './MetricCard.vue'
import ResourceTrendChart from './ResourceTrendChart.vue'
import SectionPanel from './SectionPanel.vue'
import type { ResourceMetric, SystemMonitorSnapshot } from './types'

const props = defineProps<{
  resources: ResourceMetric[]
  snapshot: SystemMonitorSnapshot
}>()

const serverDetails = computed(() => [
  { label: '主机名称', value: props.snapshot.hostname },
  { label: '操作系统', value: props.snapshot.os },
  { label: '内核版本', value: props.snapshot.kernel },
  { label: '运行时间', value: props.snapshot.uptime },
])
</script>
