<template>
  <SectionPanel
    title="Redis 监控"
    icon="i-lucide:database-zap"
    description="内存、客户端、命令吞吐和集群节点"
  >
    <div class="grid grid-cols-2 gap-10 sm:grid-cols-4">
      <SummaryMetric
        v-for="item in summaryItems"
        :key="item.label"
        :label="item.label"
        :tone="item.tone"
        :value="item.value"
      />
    </div>
    <div class="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div
        v-for="node in redis.nodes"
        :key="node.id"
        class="rounded-8 border-1 border-solid border-color-2 bg-container-secondary p-12"
      >
        <div class="flex items-start justify-between gap-10">
          <div class="min-w-0">
            <div class="flex items-center gap-7">
              <span class="size-7 rounded-full bg-success" />
              <span class="truncate text-sm text-main font-600">{{
                node.name
              }}</span>
            </div>
            <div class="mt-4 text-xs text-secondary">
              {{ node.role }} · {{ node.memory }}
            </div>
          </div>
          <span
            class="rounded-999 bg-success-tint px-7 py-3 text-xs text-success"
            >运行正常</span
          >
        </div>
        <div class="mt-12 grid grid-cols-3 gap-8 text-xs">
          <div>
            <div class="text-secondary">Key 数量</div>
            <div class="mt-4 text-sm text-main font-600">{{ node.keys }}</div>
          </div>
          <div>
            <div class="text-secondary">命中率</div>
            <div class="mt-4 text-sm text-main font-600">
              {{ node.hitRate }}%
            </div>
          </div>
          <div>
            <div class="text-secondary">OPS</div>
            <div class="mt-4 text-sm text-main font-600">
              {{ node.ops.toLocaleString() }}/s
            </div>
          </div>
        </div>
      </div>
    </div>
  </SectionPanel>
</template>

<script setup lang="ts">
import SectionPanel from './SectionPanel.vue'
import SummaryMetric from './SummaryMetric.vue'
import type { RedisSnapshot, SummaryMetricItem } from './types'

const props = defineProps<{
  redis: RedisSnapshot
}>()

const summaryItems = computed<SummaryMetricItem[]>(() => [
  {
    label: '内存占用',
    value: `${props.redis.memoryUsed} / ${props.redis.memoryTotal}`,
    tone: props.redis.memoryPercent >= 75 ? 'warning' : 'primary',
  },
  {
    label: '连接客户端',
    value: `${props.redis.connectedClients} 个`,
    tone: 'info',
  },
  {
    label: '命令吞吐',
    value: `${props.redis.commandsPerSecond.toLocaleString()}/s`,
    tone: 'primary',
  },
  { label: '缓存命中率', value: `${props.redis.hitRate}%`, tone: 'success' },
])
</script>
