<script setup lang="ts">
import {
  taskStatusFilterOptions,
  taskTimeFilterOptions,
  taskTypeFilterOptions,
} from '../constants'
import type {
  TaskCenterStatusFilter,
  TaskCenterTimeFilter,
  TaskCenterTypeFilter,
} from '../types'

const keyword = defineModel<string>('keyword', { required: true })
const status = defineModel<TaskCenterStatusFilter>('status', { required: true })
const taskType = defineModel<TaskCenterTypeFilter>('type', { required: true })
const time = defineModel<TaskCenterTimeFilter>('time', { required: true })

defineProps<{
  hasFinishedTasks: boolean
}>()

const emit = defineEmits<{
  create: []
  reset: []
  clearFinished: []
}>()
</script>

<template>
  <section
    class="rounded-6 border-1 border-color-2 border-solid bg-container p-12"
  >
    <div class="flex flex-wrap items-center justify-between gap-10">
      <div class="min-w-0">
        <h3 class="m-0 text-base text-main font-700">任务队列</h3>
        <p class="m-0 mt-4 text-xs text-secondary">
          管理导入、导出、下载、同步和备份任务
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-8 max-sm:w-full">
        <a-button
          class="max-sm:w-full"
          :disabled="!hasFinishedTasks"
          @click="emit('clearFinished')"
        >
          <template #icon>
            <Icon name="i-lucide:eraser" />
          </template>
          清空已结束
        </a-button>
        <a-button type="primary" class="max-sm:w-full" @click="emit('create')">
          <template #icon>
            <Icon name="i-lucide:plus" />
          </template>
          新建任务
        </a-button>
      </div>
    </div>

    <div
      class="mt-12 grid grid-cols-[minmax(180px,1fr)_150px_150px_150px_auto] gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1"
    >
      <a-input
        v-model:value="keyword"
        allow-clear
        placeholder="搜索任务、负责人、来源或目标"
      >
        <template #prefix>
          <Icon name="i-lucide:search" class="text-secondary" />
        </template>
      </a-input>
      <a-select v-model:value="taskType" :options="taskTypeFilterOptions" />
      <a-select v-model:value="status" :options="taskStatusFilterOptions" />
      <a-select v-model:value="time" :options="taskTimeFilterOptions" />
      <a-button class="max-lg:w-full" @click="emit('reset')">
        <template #icon>
          <Icon name="i-lucide:rotate-ccw" />
        </template>
        重置
      </a-button>
    </div>
  </section>
</template>
