<template>
  <SectionPanel
    title="数据库监控"
    icon="i-lucide:database"
    description="查询吞吐、连接池、查询质量和实例可用性"
  >
    <div class="grid grid-cols-2 gap-10 sm:grid-cols-3 xl:grid-cols-6">
      <SummaryMetric
        v-for="item in summaryItems"
        :key="item.label"
        :label="item.label"
        :tone="item.tone"
        :value="item.value"
      />
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import SectionPanel from './SectionPanel.vue'
import SummaryMetric from './SummaryMetric.vue'
import type { DatabaseSnapshot, SummaryMetricItem } from './types'

const props = defineProps<{
  database: DatabaseSnapshot
}>()

const totalConnections = computed(() =>
  props.database.instances.reduce(
    (total, item) => total + item.maxConnections,
    0
  )
)

const connectionUsage = computed(() => {
  if (!totalConnections.value) return 0
  return Number(
    ((props.database.connections / totalConnections.value) * 100).toFixed(1)
  )
})

const healthyInstanceCount = computed(
  () =>
    props.database.instances.filter((item) => item.status === 'healthy').length
)

const summaryItems = computed<SummaryMetricItem[]>(() => [
  {
    label: '总 QPS',
    value: props.database.qps.toLocaleString(),
    tone: 'primary',
  },
  {
    label: '活跃连接',
    value: `${props.database.connections} / ${totalConnections.value}`,
    tone: 'info',
  },
  {
    label: '连接使用率',
    value: `${connectionUsage.value}%`,
    tone: connectionUsage.value >= 80 ? 'warning' : 'success',
  },
  {
    label: '慢查询',
    value: `${props.database.slowQueries} 条`,
    tone: props.database.slowQueries ? 'warning' : 'success',
  },
  {
    label: '平均缓存命中',
    value: `${props.database.cacheHit}%`,
    tone: 'success',
  },
  {
    label: '健康实例',
    value: `${healthyInstanceCount.value} / ${props.database.instances.length}`,
    tone:
      healthyInstanceCount.value === props.database.instances.length
        ? 'success'
        : 'warning',
  },
])
</script>
