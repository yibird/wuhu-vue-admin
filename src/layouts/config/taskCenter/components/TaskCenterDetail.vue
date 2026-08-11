<script setup lang="ts">
import { computed } from 'vue'
import { taskStatusMeta, taskTypeMeta } from '../constants'
import type { TaskCenterItem } from '../types'

const props = defineProps<{
  task: TaskCenterItem | null
}>()

const emit = defineEmits<{
  pause: [task: TaskCenterItem]
  resume: [task: TaskCenterItem]
  retry: [task: TaskCenterItem]
  cancel: [task: TaskCenterItem]
  delete: [task: TaskCenterItem]
  copy: [task: TaskCenterItem]
}>()

const canPause = computed(() => props.task?.status === 'running')
const canResume = computed(
  () => props.task?.status === 'paused' || props.task?.status === 'waiting'
)
const canRetry = computed(
  () => props.task?.status === 'failed' || props.task?.status === 'canceled'
)
const canCancel = computed(() => {
  if (!props.task) return false
  return !['success', 'failed', 'canceled'].includes(props.task.status)
})
</script>

<template>
  <div
    class="h-full min-h-0 flex flex-col overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-container"
  >
    <template v-if="task">
      <div
        class="border-b-1 border-b-solid border-color-1 bg-container-secondary px-16 py-14"
      >
        <div class="flex flex-wrap items-start justify-between gap-12">
          <div class="min-w-0">
            <div class="flex min-w-0 items-center gap-10">
              <span
                class="size-36 shrink-0 flex items-center justify-center rounded-8 border-1 border-solid"
                :class="taskTypeMeta[task.type].class"
              >
                <Icon :name="taskTypeMeta[task.type].icon" :size="18" />
              </span>
              <div class="min-w-0">
                <h3 class="m-0 truncate text-base text-main font-700">
                  {{ task.title }}
                </h3>
                <div class="mt-4 flex flex-wrap items-center gap-6">
                  <a-tag :color="taskTypeMeta[task.type].color">
                    {{ taskTypeMeta[task.type].label }}
                  </a-tag>
                  <a-tag :color="taskStatusMeta[task.status].color">
                    {{ taskStatusMeta[task.status].label }}
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-8">
            <a-button v-if="canPause" size="small" @click="emit('pause', task)">
              <template #icon>
                <Icon name="i-lucide:pause" />
              </template>
              暂停
            </a-button>
            <a-button
              v-if="canResume"
              size="small"
              type="primary"
              @click="emit('resume', task)"
            >
              <template #icon>
                <Icon name="i-lucide:play" />
              </template>
              继续
            </a-button>
            <a-button
              v-if="canRetry"
              size="small"
              type="primary"
              @click="emit('retry', task)"
            >
              <template #icon>
                <Icon name="i-lucide:rotate-cw" />
              </template>
              重试
            </a-button>
            <a-button size="small" @click="emit('copy', task)">
              <template #icon>
                <Icon name="i-lucide:copy" />
              </template>
              复制
            </a-button>
          </div>
        </div>
      </div>

      <Scrollbar class="min-h-0 flex-1" content-class="p-16">
        <p class="m-0 text-sm text-regular">{{ task.description }}</p>

        <div class="mt-16 rounded-6 border-1 border-color-2 border-solid p-14">
          <div class="flex items-center justify-between gap-12 text-sm">
            <span class="text-secondary">执行进度</span>
            <span class="text-main font-700">{{ task.progress }}%</span>
          </div>
          <a-progress
            class="mt-8"
            :percent="task.progress"
            :status="task.status === 'failed' ? 'exception' : undefined"
          />
          <div class="mt-10 grid grid-cols-2 gap-10 text-xs max-sm:grid-cols-1">
            <div>
              <div class="text-secondary">任务大小</div>
              <div class="mt-4 text-main font-600">{{ task.size }}</div>
            </div>
            <div>
              <div class="text-secondary">当前速度</div>
              <div class="mt-4 text-main font-600">{{ task.speed }}</div>
            </div>
          </div>
        </div>

        <div class="mt-14 grid grid-cols-2 gap-10 max-sm:grid-cols-1">
          <div class="rounded-6 bg-container-secondary p-12">
            <div class="text-xs text-secondary">来源</div>
            <div class="mt-6 break-all text-sm text-main">
              {{ task.source }}
            </div>
          </div>
          <div class="rounded-6 bg-container-secondary p-12">
            <div class="text-xs text-secondary">目标</div>
            <div class="mt-6 break-all text-sm text-main">
              {{ task.target }}
            </div>
          </div>
          <div class="rounded-6 bg-container-secondary p-12">
            <div class="text-xs text-secondary">负责人</div>
            <div class="mt-6 text-sm text-main">{{ task.owner }}</div>
          </div>
          <div class="rounded-6 bg-container-secondary p-12">
            <div class="text-xs text-secondary">更新时间</div>
            <div class="mt-6 text-sm text-main">{{ task.updatedAt }}</div>
          </div>
        </div>

        <div class="mt-16">
          <div class="mb-10 flex items-center justify-between gap-10">
            <span class="text-sm text-main font-700">执行日志</span>
            <span class="text-xs text-secondary"
              >创建于 {{ task.createdAt }}</span
            >
          </div>
          <div class="rounded-6 bg-fill-quaternary p-12">
            <div
              v-for="(log, index) in task.logs"
              :key="`${task.id}-${index}`"
              class="flex gap-8 py-6 text-xs"
            >
              <span class="mt-5 size-6 shrink-0 rounded-full bg-primary" />
              <span class="text-regular">{{ log }}</span>
            </div>
          </div>
        </div>

        <div class="mt-16 flex flex-wrap justify-end gap-8">
          <a-button v-if="canCancel" danger @click="emit('cancel', task)">
            <template #icon>
              <Icon name="i-lucide:ban" />
            </template>
            取消任务
          </a-button>
          <a-button danger @click="emit('delete', task)">
            <template #icon>
              <Icon name="i-lucide:trash-2" />
            </template>
            删除记录
          </a-button>
        </div>
      </Scrollbar>
    </template>

    <div v-else class="min-h-0 flex-1 flex items-center justify-center p-20">
      <a-empty description="请选择一个任务" />
    </div>
  </div>
</template>
