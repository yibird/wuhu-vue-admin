<template>
  <div
    class="task-card-panel rounded-6 border-1 border-color-2 border-solid bg-container transition-[border-color,box-shadow] hover:(border-color-primary shadow-all-md)"
  >
    <div class="p-10 pb-6">
      <div class="flex items-start justify-between gap-8">
        <div class="min-w-0 text-sm text-main font-600 leading-20px">
          {{ item.title }}
        </div>
        <a-tag :bordered="false" :color="priorityMeta.color" class="shrink-0">
          <span class="inline-flex items-center gap-3">
            <Icon :name="priorityMeta.icon" :size="12" />
            {{ priorityMeta.label }}
          </span>
        </a-tag>
      </div>
    </div>
    <div class="px-10 text-xs text-secondary line-clamp-2">
      {{ item.description }}
    </div>
    <div
      v-if="item.module || item.estimatedHours || item.tags?.length"
      class="mt-8 px-10 flex flex-wrap items-center gap-6 text-11px text-secondary"
    >
      <a-tag v-if="item.module" :bordered="false" color="blue">
        {{ item.module }}
      </a-tag>
      <a-tag v-if="item.estimatedHours" :bordered="false" color="purple">
        {{ item.estimatedHours }}h
      </a-tag>
      <a-tag v-for="tag in item.tags ?? []" :key="tag" :bordered="false">
        {{ tag }}
      </a-tag>
    </div>
    <div class="my-10 px-10 flex items-center justify-between gap-8">
      <div class="min-w-0 flex items-center gap-8">
        <span
          class="size-26 shrink-0 flex items-center justify-center rounded-full text-xs font-600"
          :class="assigneeMeta.avatarClass"
        >
          {{ assigneeInitial }}
        </span>
        <div class="min-w-0">
          <div class="truncate text-xs text-main">{{ assigneeMeta.label }}</div>
          <div class="truncate text-11px text-secondary">
            {{ assigneeMeta.role }}
          </div>
        </div>
      </div>
      <span
        class="shrink-0 inline-flex items-center gap-4 text-xs"
        :class="dueMeta.class"
        :title="dueMeta.fullText"
      >
        <Icon :name="dueMeta.icon" :size="13" />
        {{ dueMeta.text }}
      </span>
    </div>
    <div
      class="p-10 flex items-center border-t-1 border-t-solid border-color-2"
    >
      <span
        class="flex-1 inline-flex items-center justify-center gap-4 text-xs text-muted cursor-pointer hover:text-primary"
        @click="emit('edit', item)"
      >
        <Icon name="i-lucide:pencil" :size="13" />
        修改
      </span>
      <a-divider vertical />
      <span
        class="flex-1 inline-flex items-center justify-center gap-4 text-xs text-muted cursor-pointer hover:text-error"
        @click="emit('delete', item)"
      >
        <Icon name="i-lucide:trash-2" :size="13" />
        删除
      </span>
      <a-divider vertical />
      <span
        class="flex-1 inline-flex items-center justify-center text-xs text-muted cursor-pointer"
      >
        <Icon name="i-lucide:ellipsis" :size="15" />
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  getTaskAssigneeMeta,
  getTaskDueMeta,
  getTaskPriorityMeta,
} from '../../constants'
import type { CardTaskItemProps, TaskActionEmits } from '../types'
const { item } = defineProps<CardTaskItemProps>()
const emit = defineEmits<TaskActionEmits>()

const priorityMeta = computed(() => getTaskPriorityMeta(item.priority))
const assigneeMeta = computed(() => getTaskAssigneeMeta(item.assignee))
const dueMeta = computed(() => getTaskDueMeta(item.dueDate, item.status))
const assigneeInitial = computed(() => assigneeMeta.value.label.slice(0, 1))
</script>
