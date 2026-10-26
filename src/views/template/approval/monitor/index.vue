<template>
  <WView :full="true" :padding="0">
    <div class="h-full min-h-0 flex flex-col overflow-hidden bg-page">
      <header
        class="page-enter page-enter--1 flex flex-none flex-wrap items-center gap-10 b-b-1-regular bg-container px-12 py-10 sm:px-16"
      >
        <span
          class="size-38 flex flex-none items-center justify-center rounded-8 bg-primary/12 text-primary"
        >
          <Icon name="i-lucide:activity" :size="19" />
        </span>
        <div class="min-w-0 flex-1">
          <h1 class="m-0 text-base text-main font-700">流程监控</h1>
          <p class="m-0 mt-2 text-xs text-secondary">
            审批实例运行情况，每 15 秒自动刷新
          </p>
        </div>
        <a-button :loading="loading" @click="refreshAll">
          <template #icon><Icon name="i-lucide:refresh-cw" /></template>
          刷新
        </a-button>
      </header>

      <main
        class="page-enter page-enter--2 min-h-0 flex-1 overflow-y-auto p-12 sm:p-16"
      >
        <div
          class="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8"
        >
          <div
            v-for="item in statCards"
            :key="item.key"
            class="relative overflow-hidden rounded-8 b-1-regular bg-container px-14 py-12"
          >
            <div class="text-xs text-secondary">{{ item.label }}</div>
            <div class="mt-4 text-2xl text-main font-700 tabular-nums">
              {{ item.value }}
            </div>
            <Icon
              :name="item.icon"
              :size="32"
              class="absolute right-12 top-1/2 -translate-y-1/2 opacity-10"
              :class="item.tone"
            />
          </div>
        </div>

        <div
          class="mb-12 flex flex-wrap items-center gap-10 rounded-8 b-1-regular bg-container p-12"
        >
          <a-input-search
            v-model:value="keyword"
            allow-clear
            class="w-full sm:w-220"
            placeholder="搜索实例标题/发起人"
            @search="search"
          />
          <a-select
            v-model:value="definitionId"
            allow-clear
            class="w-full sm:w-200"
            placeholder="全部审批流"
            :options="definitionOptions"
            show-search
            option-filter-prop="label"
            @change="search"
          />
          <a-select
            v-model:value="status"
            allow-clear
            class="w-full sm:w-140"
            placeholder="全部状态"
            :options="statusOptions"
            @change="search"
          />
          <a-button @click="reset">重置</a-button>
        </div>

        <a-table
          :columns="columns"
          :data-source="list"
          :loading="loading"
          :pagination="tablePagination"
          row-key="id"
          @change="onTableChange"
        />
      </main>

      <a-drawer
        :open="drawerOpen"
        :title="detail?.title ?? '审批实例详情'"
        :width="520"
        @close="closeDetail"
      >
        <a-spin :spinning="detailLoading">
          <template v-if="detail">
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="审批流">
                {{ detail.definitionName }}
              </a-descriptions-item>
              <a-descriptions-item label="发起人">
                {{ detail.initiatorName }} · {{ detail.deptName || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag :color="instanceStatusMeta[detail.status].color">
                  {{ instanceStatusMeta[detail.status].label }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="当前节点">
                {{ detail.currentNode || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="进度">
                <a-progress :percent="detail.progress" size="small" />
              </a-descriptions-item>
              <a-descriptions-item label="开始时间">
                {{ formatDateTime(detail.startedAt) }}
              </a-descriptions-item>
              <a-descriptions-item label="耗时">
                {{ formatDuration(detail.durationMs) }}
              </a-descriptions-item>
            </a-descriptions>

            <h3 class="mb-10 mt-20 text-sm text-main font-700">流转记录</h3>
            <a-timeline>
              <a-timeline-item
                v-for="step in detail.steps"
                :key="step.id"
                :color="stepColor(step.status)"
              >
                <div class="flex flex-wrap items-center gap-8">
                  <strong class="text-sm text-main">{{ step.nodeName }}</strong>
                  <a-tag :bordered="false" :color="stepTagColor(step.status)">
                    {{ stepStatusLabel(step.status) }}
                  </a-tag>
                </div>
                <p class="m-0 mt-3 text-xs text-secondary">
                  处理人：{{ step.approverName }}
                  <template v-if="step.handledAt">
                    · {{ formatDateTime(step.handledAt) }}
                  </template>
                </p>
                <p v-if="step.comment" class="m-0 mt-3 text-xs text-regular">
                  {{ step.comment }}
                </p>
              </a-timeline-item>
            </a-timeline>
          </template>
        </a-spin>
      </a-drawer>
    </div>
  </WView>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Button, Progress, Tag } from 'antdv-next'
import { Icon } from '@/components/icon'
import {
  formatDateTime,
  formatDuration,
  instanceStatusMeta,
  instanceStatusOptions,
} from '../shared'
import { useApprovalMonitor } from './hooks'
import type { ApprovalInstanceResp, ApprovalInstanceStepStatus } from '@/apis'
import type { TableColumnsType, TablePaginationConfig } from 'antdv-next'

const {
  current,
  definitionId,
  definitionOptions,
  detail,
  detailLoading,
  drawerOpen,
  keyword,
  list,
  loading,
  pageSize,
  status,
  summary,
  total,
  closeDetail,
  onPageChange,
  openDetail,
  refreshAll,
  reset,
  search,
} = useApprovalMonitor()

const statusOptions = instanceStatusOptions.map((item) => ({
  label: item.label,
  value: item.value,
}))

const statCards = computed(() => {
  const value = summary.value
  return [
    {
      key: 'total',
      label: '实例总数',
      value: value?.total ?? 0,
      icon: 'i-lucide:files',
      tone: 'text-primary',
    },
    {
      key: 'running',
      label: '运行中',
      value: value?.running ?? 0,
      icon: 'i-lucide:loader-circle',
      tone: 'text-info',
    },
    {
      key: 'pending',
      label: '待审批',
      value: value?.pending ?? 0,
      icon: 'i-lucide:clock-3',
      tone: 'text-warning',
    },
    {
      key: 'approved',
      label: '已通过',
      value: value?.approved ?? 0,
      icon: 'i-lucide:check-circle-2',
      tone: 'text-success',
    },
    {
      key: 'rejected',
      label: '已驳回',
      value: value?.rejected ?? 0,
      icon: 'i-lucide:x-circle',
      tone: 'text-error',
    },
    {
      key: 'timeout',
      label: '已超时',
      value: value?.timeout ?? 0,
      icon: 'i-lucide:alarm-clock',
      tone: 'text-error',
    },
    {
      key: 'successRate',
      label: '通过率',
      value: `${value?.successRate ?? 0}%`,
      icon: 'i-lucide:gauge',
      tone: 'text-primary',
    },
    {
      key: 'averageDuration',
      label: '平均耗时',
      value: formatDuration(value?.averageDurationMs),
      icon: 'i-lucide:timer',
      tone: 'text-primary',
    },
  ]
})

const columns: TableColumnsType<ApprovalInstanceResp> = [
  { title: '实例标题', dataIndex: 'title', width: 220, ellipsis: true },
  {
    title: '审批流',
    dataIndex: 'definitionName',
    width: 160,
    ellipsis: true,
  },
  {
    title: '发起人',
    key: 'initiator',
    width: 140,
    render: (_value, record) =>
      `${record.initiatorName}${record.deptName ? ` · ${record.deptName}` : ''}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 96,
    render: (value: ApprovalInstanceResp['status']) =>
      h(
        Tag,
        { color: instanceStatusMeta[value].color },
        { default: () => instanceStatusMeta[value].label }
      ),
  },
  {
    title: '当前节点',
    dataIndex: 'currentNode',
    width: 140,
    render: (value: string | undefined) => value || '-',
  },
  {
    title: '进度',
    dataIndex: 'progress',
    width: 150,
    render: (value: number) =>
      h(Progress, { percent: value, size: 'small', showInfo: false }),
  },
  {
    title: '开始时间',
    dataIndex: 'startedAt',
    width: 150,
    render: (value: string) => formatDateTime(value),
  },
  {
    title: '耗时',
    dataIndex: 'durationMs',
    width: 120,
    render: (value: number | undefined) => formatDuration(value),
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 90,
    render: (_value, record) =>
      h(
        Button,
        { type: 'link', onClick: () => void openDetail(record) },
        { default: () => '详情' }
      ),
  },
]

const tablePagination = computed<TablePaginationConfig>(() => ({
  current: current.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (value: number) => `共 ${value} 条`,
}))

function onTableChange(page: TablePaginationConfig) {
  onPageChange(page.current ?? 1, page.pageSize ?? 10)
}

const stepStatusLabels: Record<ApprovalInstanceStepStatus, string> = {
  pending: '待处理',
  approved: '已通过',
  rejected: '已驳回',
  skipped: '已跳过',
}

const stepColors: Record<ApprovalInstanceStepStatus, string> = {
  pending: 'gray',
  approved: 'green',
  rejected: 'red',
  skipped: 'gray',
}

const stepTagColors: Record<ApprovalInstanceStepStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  skipped: 'default',
}

function stepStatusLabel(statusValue: ApprovalInstanceStepStatus) {
  return stepStatusLabels[statusValue] ?? statusValue
}

function stepColor(statusValue: ApprovalInstanceStepStatus) {
  return stepColors[statusValue] ?? 'gray'
}

function stepTagColor(statusValue: ApprovalInstanceStepStatus) {
  return stepTagColors[statusValue] ?? 'default'
}
</script>
