<script setup lang="ts">
import dayjs from 'dayjs'
import { message } from 'antdv-next'
import { Gantt } from '@/components/gantt'
import { Scrollbar } from '@/components/scrollbar'
import type { GanttTask, GanttViewMode } from '@/components/gantt'

const viewMode = shallowRef<GanttViewMode>('Week')
const tasks = shallowRef<GanttTask[]>([
  {
    id: 'discovery',
    name: '需求梳理',
    start: '2026-08-03',
    end: '2026-08-07',
    progress: 100,
  },
  {
    id: 'architecture',
    name: '架构设计',
    start: '2026-08-06',
    end: '2026-08-12',
    progress: 72,
    dependencies: ['discovery'],
  },
  {
    id: 'implementation',
    name: '组件实现',
    start: '2026-08-11',
    end: '2026-08-21',
    progress: 38,
    dependencies: ['architecture'],
  },
  {
    id: 'verification',
    name: '集成验证',
    start: '2026-08-20',
    end: '2026-08-27',
    progress: 8,
    dependencies: ['implementation'],
  },
])

function updateTaskDate(task: GanttTask, start: Date, end: Date) {
  tasks.value = tasks.value.map((item) =>
    item.id === task.id
      ? {
          ...item,
          start: dayjs(start).format('YYYY-MM-DD'),
          end: dayjs(end).format('YYYY-MM-DD'),
        }
      : item
  )
}

function updateTaskProgress(task: GanttTask, progress: number) {
  tasks.value = tasks.value.map((item) =>
    item.id === task.id ? { ...item, progress: Math.round(progress) } : item
  )
}

function handleContextMenu(task: GanttTask) {
  message.info(`右键任务「${task.name}」`)
}
</script>

<template>
  <WView :full="true" :padding="false" class="bg-page">
    <Scrollbar class="h-full" content-class="min-h-full p-16 md:p-20">
      <section
        class="mx-auto max-w-1280 rounded-8 border-1 border-color-1 border-solid bg-container p-16 shadow-all-sm md:p-20"
      >
        <header
          class="mb-16 flex flex-wrap items-start justify-between gap-12 border-b-1 border-color-1 border-b-solid pb-14"
        >
          <div class="min-w-0">
            <h1 class="m-0 text-xl text-main font-600">Gantt</h1>
            <p class="mb-0 mt-6 text-sm leading-22 text-secondary">
              支持任务日期、进度拖拽与上下文菜单的甘特图。
            </p>
          </div>
          <a-tag color="blue">src/components/gantt</a-tag>
        </header>

        <div class="grid gap-12">
          <div class="flex flex-wrap items-center justify-between gap-10">
            <a-segmented
              v-model:value="viewMode"
              :options="['Day', 'Week', 'Month']"
            />
            <span class="text-xs text-muted">拖拽任务条调整日期或进度</span>
          </div>
          <div class="h-500 min-w-0">
            <Gantt
              :tasks="tasks"
              :view-mode="viewMode"
              @date-change="updateTaskDate"
              @progress-change="updateTaskProgress"
              @context-menu="({ task }) => handleContextMenu(task)"
            />
          </div>
        </div>
      </section>
    </Scrollbar>
  </WView>
</template>
