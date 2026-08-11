<script lang="ts" setup>
import {
  getTaskAssigneeMeta,
  getTaskDueMeta,
  getTaskPriorityMeta,
} from '../../constants'
import type { Task } from '../types'
import { statusBarClass, taskProgress } from './utils'

interface Props {
  readonly items: Task[]
  readonly selectedTaskId: number | null
}

interface Emits {
  select: [taskId: number]
  edit: [task: Task]
  delete: [task: Task]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function priorityMeta(task: Task) {
  return getTaskPriorityMeta(task.priority)
}

function assigneeMeta(task: Task) {
  return getTaskAssigneeMeta(task.assignee)
}

function dueMeta(task: Task) {
  return getTaskDueMeta(task.dueDate, task.status)
}
</script>

<template>
  <Scrollbar
    class="h-176 min-h-0 rounded-4 bg-container"
    content-class="min-w-900 p-12"
  >
    <div class="flex flex-col gap-8">
      <div
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[240px_minmax(260px,1fr)_130px_190px_120px] items-center gap-12 rounded-4 border-1 border-color-2 border-solid bg-main px-12 py-10 transition-colors"
        :class="
          item.id === selectedTaskId ? 'border-primary bg-selected-1' : ''
        "
        @click="emit('select', item.id)"
      >
        <div class="min-w-0">
          <div class="truncate font-600 text-main">{{ item.title }}</div>
          <div class="mt-2 truncate text-xs text-secondary">
            {{ item.description }}
          </div>
        </div>
        <div class="min-w-0">
          <div class="mb-5 flex items-center justify-between gap-8">
            <span class="text-xs text-secondary">
              {{ taskProgress(item) }}%
            </span>
            <a-tag :bordered="false" :color="priorityMeta(item).color">
              <span class="inline-flex items-center gap-3">
                <Icon :name="priorityMeta(item).icon" :size="12" />
                {{ priorityMeta(item).label }}
              </span>
            </a-tag>
          </div>
          <div class="h-10 overflow-hidden rounded-full bg-fill-tertiary">
            <div
              class="h-full rounded-full"
              :class="statusBarClass(item.status)"
              :style="{ width: `${taskProgress(item)}%` }"
            />
          </div>
        </div>
        <div class="min-w-0 flex items-center gap-8">
          <span
            class="size-24 shrink-0 flex items-center justify-center rounded-full text-11px font-600"
            :class="assigneeMeta(item).avatarClass"
          >
            {{ assigneeMeta(item).label.slice(0, 1) }}
          </span>
          <span class="truncate text-xs text-main">
            {{ assigneeMeta(item).label }}
          </span>
        </div>
        <div class="text-xs">
          <span
            class="inline-flex items-center gap-4"
            :class="dueMeta(item).class"
            :title="dueMeta(item).fullText"
          >
            <Icon :name="dueMeta(item).icon" :size="13" />
            {{ dueMeta(item).fullText }}
          </span>
        </div>
        <div class="text-right">
          <a-button type="link" size="small" @click.stop="emit('edit', item)">
            <template #icon>
              <Icon name="i-lucide:pencil" />
            </template>
            修改
          </a-button>
          <a-button
            type="link"
            size="small"
            danger
            @click.stop="emit('delete', item)"
          >
            <template #icon>
              <Icon name="i-lucide:trash-2" />
            </template>
            删除
          </a-button>
        </div>
      </div>
      <a-empty v-if="items.length === 0" class="py-24" />
    </div>
  </Scrollbar>
</template>
