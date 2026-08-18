<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { workflowAlertSeverityMeta } from '../../management/meta'
import type {
  WorkflowAlert,
  WorkflowLatencyRank,
  WorkflowThroughputPoint,
} from '../../management/types'

const props = defineProps<{
  alerts: WorkflowAlert[]
  latencyRanks: WorkflowLatencyRank[]
  throughput: WorkflowThroughputPoint[]
}>()

const emit = defineEmits<{
  acknowledge: [id: string]
  openInstance: [id: string]
}>()

const maxThroughput = computed(() =>
  Math.max(...props.throughput.map((item) => item.success + item.failed), 1)
)
const maxLatency = computed(() =>
  Math.max(
    ...props.latencyRanks.map((item) =>
      item.unit === 's' ? item.duration * 1000 : item.duration
    ),
    1
  )
)
const unresolvedAlertCount = computed(
  () => props.alerts.filter((item) => !item.acknowledged).length
)

function latencyPercent(item: WorkflowLatencyRank) {
  const duration = item.unit === 's' ? item.duration * 1000 : item.duration
  return `${Math.max(8, (duration / maxLatency.value) * 100)}%`
}
</script>

<template>
  <div
    class="grid min-w-0 grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)] gap-10 max-xl:grid-cols-1"
  >
    <section
      class="min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
    >
      <div
        class="flex items-center justify-between gap-10 border-b-1 border-color-2 border-b-solid px-14 py-11"
      >
        <div>
          <h2 class="m-0 text-sm text-main font-650">执行吞吐与慢节点</h2>
          <p class="m-0 mt-2 text-xs text-secondary">按 5 分钟聚合的执行结果</p>
        </div>
        <div class="flex items-center gap-10 text-xs text-secondary">
          <span class="inline-flex items-center gap-4">
            <i class="size-7 rounded-full bg-success"></i>成功
          </span>
          <span class="inline-flex items-center gap-4">
            <i class="size-7 rounded-full bg-error"></i>失败
          </span>
        </div>
      </div>

      <div
        class="grid grid-cols-[minmax(0,1fr)_260px] gap-0 max-lg:grid-cols-1"
      >
        <div
          class="min-w-0 border-r-1 border-color-2 border-r-solid p-14 max-lg:border-b-1 max-lg:border-r-0 max-lg:border-b-solid"
        >
          <div class="h-176 flex items-end gap-8" aria-label="流程执行吞吐图">
            <div
              v-for="point in throughput"
              :key="point.label"
              class="h-full min-w-0 flex flex-1 flex-col justify-end"
            >
              <div class="flex flex-1 items-end justify-center">
                <Motion
                  as="div"
                  :initial="{ opacity: 0, scaleY: 0 }"
                  :animate="{ opacity: 1, scaleY: 1 }"
                  :transition="{ duration: 0.42, ease: 'easeOut' }"
                  class="relative w-full max-w-36 origin-bottom overflow-hidden rounded-t-4 bg-success/18"
                  :style="{
                    height: `${((point.success + point.failed) / maxThroughput) * 100}%`,
                  }"
                >
                  <div
                    class="pointer-events-none absolute inset-x-0 bottom-0 bg-success"
                    :style="{
                      height: `${(point.success / (point.success + point.failed)) * 100}%`,
                    }"
                  ></div>
                  <div
                    class="pointer-events-none absolute inset-x-0 top-0 bg-error"
                    :style="{
                      height: `${(point.failed / (point.success + point.failed)) * 100}%`,
                    }"
                  ></div>
                </Motion>
              </div>
              <span class="mt-7 text-center text-xs text-secondary">
                {{ point.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-14">
          <div class="mb-10 text-xs text-secondary">节点耗时排行</div>
          <div class="flex flex-col gap-12">
            <div
              v-for="item in latencyRanks"
              :key="`${item.workflowName}-${item.node}`"
            >
              <div class="mb-5 flex items-center justify-between gap-8 text-xs">
                <span class="min-w-0 truncate text-main">{{ item.node }}</span>
                <strong class="flex-none text-main font-650">
                  {{ item.duration }}{{ item.unit }}
                </strong>
              </div>
              <div class="h-5 overflow-hidden rounded-full bg-fill-secondary">
                <div
                  class="h-full origin-left rounded-full bg-primary transition-transform duration-motion-slower"
                  :style="{ width: latencyPercent(item) }"
                ></div>
              </div>
              <div class="mt-4 truncate text-xs text-secondary">
                {{ item.workflowName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
    >
      <div
        class="flex items-center justify-between gap-8 border-b-1 border-color-2 border-b-solid px-14 py-11"
      >
        <div>
          <h2 class="m-0 text-sm text-main font-650">告警中心</h2>
          <p class="m-0 mt-2 text-xs text-secondary">
            聚合异常、超时和人工等待
          </p>
        </div>
        <a-tag :bordered="false" color="error">
          {{ unresolvedAlertCount }} 待处理
        </a-tag>
      </div>

      <div class="max-h-264 overflow-y-auto px-6 py-6">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="group flex gap-9 rounded-6 px-8 py-8 transition-colors duration-motion-fast hover:bg-hover"
          :class="{ 'opacity-55': alert.acknowledged }"
        >
          <span
            class="mt-1 size-28 flex flex-none items-center justify-center rounded-6"
            :class="[
              alert.severity === 'critical'
                ? 'bg-error-tint text-error'
                : alert.severity === 'warning'
                  ? 'bg-warning-tint text-warning'
                  : 'bg-info-tint text-info',
            ]"
          >
            <Icon
              :name="workflowAlertSeverityMeta[alert.severity].icon"
              :size="15"
            />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-6">
              <strong class="text-xs text-main font-650">{{
                alert.title
              }}</strong>
              <span class="flex-none text-xs text-secondary">{{
                alert.createdAt
              }}</span>
            </div>
            <p class="m-0 mt-3 line-clamp-2 text-xs text-regular leading-18px">
              {{ alert.message }}
            </p>
            <div class="mt-5 flex items-center justify-between gap-6">
              <button
                type="button"
                class="min-w-0 truncate border-0 bg-transparent p-0 text-left text-xs text-link cursor-pointer"
                @click="emit('openInstance', alert.instanceId)"
              >
                {{ alert.workflowName }} · {{ alert.instanceId }}
              </button>
              <a-button
                v-if="!alert.acknowledged"
                type="link"
                size="small"
                @click="emit('acknowledge', alert.id)"
              >
                确认
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
