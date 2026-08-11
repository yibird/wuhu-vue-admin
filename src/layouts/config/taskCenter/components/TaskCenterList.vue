<script setup lang="ts">
import { taskStatusMeta, taskTypeMeta } from '../constants'
import type { TaskCenterItem } from '../types'

defineProps<{
  activeTaskId: string
  items: TaskCenterItem[]
}>()

const emit = defineEmits<{
  select: [taskId: string]
}>()
</script>

<template>
  <div
    class="h-full min-h-0 flex flex-col overflow-hidden rounded-6 border-1 border-color-2 border-solid bg-container"
  >
    <div
      class="flex items-center justify-between border-b-1 border-b-solid border-color-1 px-14 py-12"
    >
      <span class="text-sm text-main font-700">任务列表</span>
      <a-tag>{{ items.length }} 项</a-tag>
    </div>

    <Scrollbar v-if="items.length" class="min-h-0 flex-1" content-class="p-8">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="mb-8 w-full rounded-6 border-1 border-color-2 border-solid bg-container p-12 text-left transition-colors hover:(border-color-primary bg-hover)"
        :class="
          item.id === activeTaskId ? 'border-color-primary bg-primary-tint' : ''
        "
        @click="emit('select', item.id)"
      >
        <div class="flex items-start justify-between gap-10">
          <div class="min-w-0">
            <div class="flex min-w-0 items-center gap-8">
              <span
                class="size-28 shrink-0 flex items-center justify-center rounded-6 border-1 border-solid"
                :class="taskTypeMeta[item.type].class"
              >
                <Icon :name="taskTypeMeta[item.type].icon" :size="15" />
              </span>
              <div class="min-w-0">
                <div class="truncate text-sm text-main font-600">
                  {{ item.title }}
                </div>
                <div class="mt-3 truncate text-xs text-secondary">
                  {{ taskTypeMeta[item.type].label }} / {{ item.owner }}
                </div>
              </div>
            </div>
          </div>
          <a-tag :color="taskStatusMeta[item.status].color">
            {{ taskStatusMeta[item.status].label }}
          </a-tag>
        </div>

        <p
          class="m-0 mt-10 overflow-hidden text-xs text-regular [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
        >
          {{ item.description }}
        </p>
        <div class="mt-10">
          <a-progress
            :percent="item.progress"
            size="small"
            :show-info="false"
            :status="item.status === 'failed' ? 'exception' : undefined"
          />
          <div
            class="mt-6 flex items-center justify-between gap-8 text-xs text-secondary"
          >
            <span>{{ item.progress }}%</span>
            <span class="truncate">{{ item.speed }}</span>
          </div>
        </div>
      </button>
    </Scrollbar>

    <div v-else class="min-h-0 flex-1 flex items-center justify-center p-20">
      <a-empty description="暂无匹配任务" />
    </div>
  </div>
</template>
