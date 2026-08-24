<template>
  <CardSkeleton v-if="loading" />
  <DragDropProvider v-else @drag-end="handleDragEnd">
    <div
      class="grid h-full min-h-0 grid-cols-1 gap-10 overflow-y-auto md:grid-cols-3 xl:grid-cols-4 xl:overflow-hidden 2xl:grid-cols-6"
    >
      <div
        v-for="item in taskStatus"
        :key="item.status"
        class="min-h-0 min-w-0 xl:max-h-full xl:overflow-hidden"
      >
        <Group
          v-bind="item"
          :items="groupItems[getTaskGroupId(item.status)] ?? []"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
        />
      </div>
    </div>
  </DragDropProvider>
</template>
<script lang="ts" setup>
import { DragDropProvider } from '@dnd-kit/vue'
import { move } from '@dnd-kit/helpers'
import Group from './Group.vue'
import CardSkeleton from './Skeleton.vue'
import { taskStatusList } from '../../constants'
import type { DragEndEvent } from '@dnd-kit/vue'
import type { Task, TaskActionEmits, TaskStatusValue } from '../types'

const emit = defineEmits<TaskActionEmits>()
const { loading = false } = defineProps<{ loading?: boolean }>()
const taskStatus = taskStatusList
const items = defineModel<Task[]>('items', { default: () => [] })
const groupItems = computed<Record<string, Task[]>>(() =>
  Object.fromEntries(
    taskStatus.map(({ status }) => [
      getTaskGroupId(status),
      items.value.filter((item) => item.status === status),
    ])
  )
)

function getTaskGroupId(status: TaskStatusValue) {
  return `task-group:${status}`
}

function flattenGroups(groups: Record<string, Task[]>) {
  return taskStatus.flatMap(({ status }) =>
    (groups[getTaskGroupId(status)] ?? []).map((item) =>
      item.status === status ? item : { ...item, status }
    )
  )
}

function handleDragEnd(event: DragEndEvent) {
  if (event.canceled) return

  const nextGroups = move(groupItems.value, event)
  if (nextGroups !== groupItems.value) {
    items.value = flattenGroups(nextGroups)
  }
}
</script>
