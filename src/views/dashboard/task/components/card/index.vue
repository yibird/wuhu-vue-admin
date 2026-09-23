<template>
  <CardSkeleton v-if="loading" />
  <DragDropProvider v-else @drag-end="handleDragEnd">
    <AnimatedGroup
      reduced-motion="user"
      :items="visibleTaskStatus"
      :get-key="(item: CardTaskStatus) => item.status"
      class="relative grid h-full min-h-0 grid-cols-1 gap-10 overflow-y-auto md:grid-cols-3 xl:grid-cols-4 xl:overflow-hidden 2xl:grid-cols-6"
      motion-class="min-h-0 min-w-0 xl:max-h-full xl:overflow-hidden"
    >
      <template #default="{ item }">
        <Group
          v-bind="item"
          :items="groupItems[getTaskGroupId(item.status)] ?? []"
          @delete="emit('delete', $event)"
          @edit="emit('edit', $event)"
        />
      </template>
    </AnimatedGroup>
  </DragDropProvider>
</template>
<script lang="ts" setup>
import { DragDropProvider } from '@dnd-kit/vue'
import { AnimatedGroup } from '@/components'
import Group from './Group.vue'
import CardSkeleton from './Skeleton.vue'
import { taskStatusList } from '../../constants'
import type { DragEndEvent } from '@dnd-kit/vue'
import type {
  CardTaskEmits,
  CardTaskStatus,
  Task,
  TaskFilterStatus,
  TaskStatusValue,
} from '../types'

const emit = defineEmits<CardTaskEmits>()
const { loading = false, status = 'all' } = defineProps<{
  loading?: boolean
  status?: TaskFilterStatus
}>()
const taskStatus = taskStatusList

const visibleTaskStatus = computed(() =>
  status === 'all'
    ? taskStatus
    : taskStatus.filter((item) => item.status === status)
)
// 拖拽结果通过 move 事件交回页面处理,这里只读取列表
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

/**
 * @param value 待识别的状态值
 * @returns 任务分组状态值,不是合法分组时返回 undefined
 */
function toTaskStatus(value: unknown) {
  return typeof value === 'number'
    ? taskStatus.find((item) => item.status === value)?.status
    : undefined
}

/**
 * @param target 拖拽落点(任务卡片或分组容器)
 * @returns 落点所属分组的状态值,识别不到时返回 undefined
 */
function resolveDropStatus(target?: DragEndEvent['operation']['target']) {
  const data = target?.data
  const fromData = toTaskStatus(
    typeof data === 'object' && data !== null && 'status' in data
      ? data.status
      : undefined
  )
  if (fromData !== undefined) return fromData

  const id = target?.id
  return typeof id === 'string' && id.startsWith('task-group:')
    ? toTaskStatus(Number(id.slice('task-group:'.length)))
    : undefined
}

function handleDragEnd(event: DragEndEvent) {
  if (event.canceled) return

  const { source, target } = event.operation
  if (!source || !target || typeof source.id !== 'number') return

  const status = resolveDropStatus(target)
  if (status === undefined) return

  const group = groupItems.value[getTaskGroupId(status)] ?? []
  const overIndex = group.findIndex((item) => item.id === target.id)
  // 落在卡片上时插到该卡片之前,落在分组空白处时追加到分组末尾
  const beforeId = overIndex === -1 ? null : group[overIndex].id

  if (beforeId === source.id) return

  emit('move', { id: source.id, status, beforeId })
}
</script>
