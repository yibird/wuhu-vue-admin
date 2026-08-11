<script setup lang="ts">
import { computed } from 'vue'
import type {
  WorkflowEnvironmentFilter,
  WorkflowMonitorRange,
  WorkflowRunStatusFilter,
} from '../composables/useWorkflowMonitor'

const props = defineProps<{
  alertCount: number
  lastRefreshAt: string
  refreshing: boolean
  workflowOptions: Array<{ label: string; value: string }>
}>()

const emit = defineEmits<{
  refresh: []
}>()

const autoRefresh = defineModel<boolean>('autoRefresh', { required: true })
const environment = defineModel<WorkflowEnvironmentFilter>('environment', {
  required: true,
})
const keyword = defineModel<string>('keyword', { required: true })
const range = defineModel<WorkflowMonitorRange>('range', { required: true })
const status = defineModel<WorkflowRunStatusFilter>('status', {
  required: true,
})
const workflow = defineModel<string>('workflow', { required: true })

const rangeOptions = [
  { label: '最近 1 小时', value: '1h' },
  { label: '最近 24 小时', value: '24h' },
  { label: '最近 7 天', value: '7d' },
]
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '运行中', value: 'running' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
  { label: '等待中', value: 'suspended' },
  { label: '已终止', value: 'terminated' },
]
const workflowSelectOptions = computed(() => [
  { label: '全部流程', value: 'all' },
  ...props.workflowOptions,
])
const environmentOptions = [
  { label: '全部环境', value: 'all' },
  { label: '生产环境', value: 'production' },
  { label: '预发环境', value: 'staging' },
]
</script>

<template>
  <header
    class="border-b-1 border-color-2 border-b-solid bg-container px-16 py-14"
  >
    <div class="flex flex-wrap items-center justify-between gap-14">
      <div class="flex min-w-0 items-center gap-10">
        <span class="size-36 flex-center rounded-6 bg-primary/10 text-primary">
          <Icon name="i-lucide:activity" :size="19" />
        </span>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-8">
            <h1 class="m-0 text-lg text-main font-700">流程监控</h1>
            <a-tag v-if="alertCount" :bordered="false" color="error">
              {{ alertCount }} 条待处理
            </a-tag>
            <a-tag v-else :bordered="false" color="success">运行正常</a-tag>
          </div>
          <p class="m-0 mt-2 text-xs text-secondary">
            最近刷新 {{ lastRefreshAt }} · 自动刷新{{
              autoRefresh ? '已开启' : '已关闭'
            }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-7">
        <span class="text-xs text-secondary">自动刷新</span>
        <a-switch v-model:checked="autoRefresh" size="small" />
        <a-button :loading="refreshing" @click="emit('refresh')">
          <template #icon>
            <Icon name="i-lucide:refresh-cw" />
          </template>
          刷新
        </a-button>
      </div>
    </div>

    <div class="mt-13 flex flex-wrap items-center gap-8">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-250 max-sm:w-full"
        placeholder="实例 ID、Trace ID 或发起人"
      >
        <template #prefix>
          <Icon name="i-lucide:search" class="text-placeholder" />
        </template>
      </a-input>
      <a-select
        v-model:value="workflow"
        class="w-180 max-sm:flex-1"
        :options="workflowSelectOptions"
      />
      <a-select
        v-model:value="status"
        class="w-128 max-sm:flex-1"
        :options="statusOptions"
      />
      <a-select
        v-model:value="environment"
        class="w-118 max-sm:flex-1"
        :options="environmentOptions"
      />
      <a-select
        v-model:value="range"
        class="ml-auto w-138 max-sm:ml-0 max-sm:flex-1"
        :options="rangeOptions"
      />
    </div>
  </header>
</template>
