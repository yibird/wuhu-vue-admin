<script setup lang="ts">
import type { TaskFilterStatus, TaskViewOption, TaskViewType } from './types'

const props = defineProps<{
  loading?: boolean
  taskCount: number
  filteredTaskCount: number
  statusOptions: Array<{ label: string; value: TaskFilterStatus }>
  viewOptions: TaskViewOption[]
}>()

const emit = defineEmits<{
  create: []
}>()

const keyword = defineModel<string>('keyword', { default: '' })
const status = defineModel<TaskFilterStatus>('status', { default: 'all' })
const view = defineModel<TaskViewType>('view', { default: 'card' })
</script>

<template>
  <div
    v-if="props.loading"
    class="min-w-0 shrink-0 flex flex-wrap items-center justify-between gap-12 rounded-4 bg-container p-12"
    aria-label="任务工具栏加载中"
    aria-busy="true"
  >
    <div class="flex flex-wrap items-center gap-8">
      <a-skeleton-button active class="!w-92" />
      <a-skeleton-button active size="small" class="!w-90" />
      <a-skeleton-button active size="small" class="!w-86" />
    </div>
    <div
      class="flex flex-1 flex-wrap items-center justify-end gap-10 max-sm:w-full"
    >
      <a-skeleton-input active class="!w-220 max-sm:!w-full" />
      <a-skeleton-input active class="!w-130 max-sm:!w-full" />
      <a-skeleton-button active class="!w-168" />
    </div>
  </div>

  <div
    v-else
    class="page-enter page-enter--1 flex flex-wrap items-center justify-between gap-12 rounded-4 bg-container p-12"
  >
    <div class="flex flex-wrap items-center gap-8">
      <a-button type="primary" @click="emit('create')">
        <template #icon>
          <Icon name="i-lucide:plus" />
        </template>
        添加任务
      </a-button>
      <a-tag color="blue">共 {{ props.taskCount }} 个任务</a-tag>
      <a-tag color="green">当前 {{ props.filteredTaskCount }} 个</a-tag>
    </div>

    <div class="flex flex-wrap items-center justify-end gap-10">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="w-220 max-sm:w-full"
        placeholder="搜索任务、负责人、优先级"
      />
      <a-select
        v-model:value="status"
        class="w-130 max-sm:w-full"
        :options="props.statusOptions"
      />
      <a-radio-group v-model:value="view" class="whitespace-nowrap">
        <a-radio-button
          v-for="item in props.viewOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>
