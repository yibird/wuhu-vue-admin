<script setup lang="ts">
import { workflowRunStatusMeta } from '../../management/meta'
import type {
  WorkflowRunInstance,
  WorkflowRunStatus,
} from '../../management/types'
import type { TableProps } from 'antdv-next'

defineProps<{
  instances: WorkflowRunInstance[]
  loading: boolean
}>()

const emit = defineEmits<{
  open: [id: string]
  retry: [id: string]
  terminate: [id: string]
}>()

const columns = [
  { title: '实例 / 流程', key: 'instance', width: 270 },
  { title: '状态', key: 'status', width: 105 },
  { title: '执行进度', key: 'progress', width: 190 },
  { title: '触发信息', key: 'trigger', width: 170 },
  { title: '开始时间', key: 'startedAt', width: 170 },
  { title: '耗时', key: 'duration', width: 100 },
  { title: '环境', key: 'environment', width: 95 },
  { title: '操作', key: 'action', width: 132, fixed: 'right' as const },
]

const onRow: TableProps<WorkflowRunInstance>['onRow'] = (record) => ({
  class: 'cursor-pointer',
  onClick: () => emit('open', record.id),
})

function getRunStatusMeta(status: WorkflowRunStatus) {
  return workflowRunStatusMeta[status]
}
</script>

<template>
  <section
    class="min-w-0 overflow-hidden rounded-8 border-1 border-color-2 border-solid bg-container shadow-[var(--w-shadow-card)]"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-8 border-b-1 border-color-2 border-b-solid px-14 py-11"
    >
      <div>
        <h2 class="m-0 text-sm text-main font-650">执行实例</h2>
        <p class="m-0 mt-2 text-xs text-secondary">
          查看实时进度、节点位置、耗时与重试情况
        </p>
      </div>
      <span class="text-xs text-secondary">当前 {{ instances.length }} 条</span>
    </div>

    <a-table
      :columns="columns"
      :data-source="instances"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: 1230 }"
      :on-row="onRow"
      row-key="id"
      size="middle"
    >
      <template #emptyText>
        <a-empty description="没有符合条件的执行实例" />
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'instance'">
          <button
            type="button"
            class="block min-w-0 w-full border-0 bg-transparent p-0 text-left cursor-pointer"
            @click.stop="emit('open', record.id)"
          >
            <span class="block truncate text-sm text-link font-600">
              {{ record.id }}
            </span>
            <span class="mt-3 block truncate text-xs text-secondary">
              {{ record.workflowName }} · {{ record.version }}
            </span>
          </button>
        </template>

        <template v-else-if="column.key === 'status'">
          <a-tag
            :bordered="false"
            :color="getRunStatusMeta(record.status).color"
          >
            <span class="inline-flex items-center gap-4">
              <Icon
                :name="getRunStatusMeta(record.status).icon"
                :class="{ 'animate-spin': record.status === 'running' }"
                :size="12"
              />
              {{ getRunStatusMeta(record.status).label }}
            </span>
          </a-tag>
        </template>

        <template v-else-if="column.key === 'progress'">
          <div class="min-w-150">
            <div class="mb-4 flex items-center justify-between gap-6 text-xs">
              <span class="truncate text-main">{{ record.currentNode }}</span>
              <span class="flex-none text-secondary"
                >{{ record.progress }}%</span
              >
            </div>
            <a-progress
              :percent="record.progress"
              :show-info="false"
              :status="record.status === 'failed' ? 'exception' : 'normal'"
              :size="6"
            />
          </div>
        </template>

        <template v-else-if="column.key === 'trigger'">
          <div class="text-xs text-main">{{ record.trigger }}</div>
          <div class="mt-3 max-w-150 truncate text-xs text-secondary">
            {{ record.initiator }}
          </div>
        </template>

        <template v-else-if="column.key === 'startedAt'">
          <span class="text-xs text-regular">{{ record.startedAt }}</span>
        </template>

        <template v-else-if="column.key === 'duration'">
          <span class="text-xs text-main">{{ record.duration }}</span>
          <div v-if="record.retries" class="mt-3 text-xs text-warning">
            重试 {{ record.retries }} 次
          </div>
        </template>

        <template v-else-if="column.key === 'environment'">
          <a-tag
            :bordered="false"
            :color="record.environment === 'production' ? 'blue' : 'default'"
          >
            {{ record.environment === 'production' ? '生产' : '预发' }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="flex items-center gap-1" @click.stop>
            <a-tooltip title="查看详情">
              <a-button
                type="text"
                size="small"
                aria-label="查看执行详情"
                @click.stop="emit('open', record.id)"
              >
                <template #icon>
                  <Icon name="i-lucide:panel-right-open" />
                </template>
              </a-button>
            </a-tooltip>
            <a-tooltip
              v-if="['failed', 'terminated'].includes(record.status)"
              title="重新执行"
            >
              <a-button
                type="text"
                size="small"
                aria-label="重新执行"
                @click.stop="emit('retry', record.id)"
              >
                <template #icon>
                  <Icon name="i-lucide:rotate-ccw" />
                </template>
              </a-button>
            </a-tooltip>
            <a-popconfirm
              v-if="['running', 'suspended'].includes(record.status)"
              title="终止执行实例"
              description="终止后当前节点不会继续执行。"
              ok-text="终止"
              ok-type="danger"
              cancel-text="取消"
              @confirm="emit('terminate', record.id)"
            >
              <a-tooltip title="终止执行">
                <a-button type="text" danger size="small" aria-label="终止执行">
                  <template #icon>
                    <Icon name="i-lucide:square" />
                  </template>
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
  </section>
</template>
