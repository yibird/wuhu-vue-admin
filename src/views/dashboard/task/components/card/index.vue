<template>
  <CardSkeleton v-if="loading" />
  <DragDropProvider
    v-else
    @drag-move="markDropPlaceholder"
    @drag-end="handleDragEnd"
    @drag-start="clearDropPlaceholder"
  >
    <div
      class="relative grid h-full min-h-0 grid-cols-1 gap-10 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 overflow-x-auto"
    >
      <DraggableItem
        v-for="(item, index) in visibleTaskStatus"
        :id="getStageId(item.status)"
        :key="item.status"
        :index="index"
        accept="task-stage"
        class="min-h-0 min-w-0 xl:(max-h-full overflow-hidden)"
        :group="stageSortableGroup"
        handle-selector=".task-group-drag-handle"
        type="task-stage"
      >
        <Group
          v-bind="item"
          :items="groupItems[getTaskGroupId(item.status)] ?? []"
          @delete="emits('delete', $event)"
          @duplicate="emits('duplicate', $event)"
          @edit="emits('edit', $event)"
          @mark-done="emits('markDone', $event)"
        />
      </DraggableItem>
    </div>
  </DragDropProvider>
</template>
<script lang="ts" setup>
import { DragDropProvider } from '@dnd-kit/vue'
import { arrayMove } from '@dnd-kit/helpers'
import { DraggableItem } from '@/components/draggable'
import Group from './group.vue'
import CardSkeleton from './skeleton.vue'
import { taskStatusList } from '../../constants'
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/vue'
import type {
  CardTaskEmits,
  CardTaskStatus,
  Task,
  TaskDropTarget,
  TaskFilterStatus,
  TaskStatusValue,
} from '../types'

const emits = defineEmits<CardTaskEmits>()
const { loading = false, status = 'all' } = defineProps<{
  loading?: boolean
  status?: TaskFilterStatus
}>()
const taskStatus = taskStatusList
/** 分组拖拽排序使用的 sortable 分组标识 */
const stageSortableGroup = 'task-stage-order'
/** 分组的展示顺序,可拖拽调整 */
const groupOrder = shallowRef<CardTaskStatus[]>([...taskStatus])

const visibleTaskStatus = computed(() =>
  status === 'all'
    ? groupOrder.value
    : groupOrder.value.filter((item) => item.status === status)
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

function getStageId(status: TaskStatusValue) {
  return `task-stage:${status}`
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
 * @param group dnd-kit 给出的分组标识
 * @returns 分组状态值,不是合法分组时返回 undefined
 */
function resolveGroupStatus(group: unknown) {
  return typeof group === 'string' && group.startsWith('task-group:')
    ? toTaskStatus(Number(group.slice('task-group:'.length)))
    : undefined
}

/**
 * 调整任务分组顺序
 *
 * 分组可能被状态筛选隐藏,因此在完整顺序上按状态值定位后再移动,
 * 避免筛选状态下拖动时丢失未显示的分组。
 *
 * @param from 拖拽前的可视下标
 * @param to 拖拽后的可视下标
 */
function moveStage(from: number, to: number) {
  const fromStatus = visibleTaskStatus.value[from]?.status
  const toStatus = visibleTaskStatus.value[to]?.status
  if (fromStatus === undefined || toStatus === undefined) return
  if (fromStatus === toStatus) return

  const order = groupOrder.value
  const fromIndex = order.findIndex((item) => item.status === fromStatus)
  const toIndex = order.findIndex((item) => item.status === toStatus)
  if (fromIndex === -1 || toIndex === -1) return

  groupOrder.value = arrayMove(order, fromIndex, toIndex)
}

/**
 * dnd-kit 的分组与下标信息
 *
 * sortable 运行时带有这些字段,但 `Draggable` 类型上没有声明,这里做一次收窄。
 */
interface SortablePlacement {
  group: unknown
  initialGroup: unknown
  index: number
  initialIndex: number
}

/**
 * @param source 拖拽源
 * @returns 拖拽源的分组与下标信息,不是 sortable 时返回 null
 */
function toSortablePlacement(source: unknown): SortablePlacement | null {
  if (typeof source !== 'object' || source === null) return null
  if (!('group' in source) || !('initialGroup' in source)) return null

  const { index, initialIndex } = source as Partial<SortablePlacement>
  if (typeof index !== 'number' || typeof initialIndex !== 'number') return null

  return source as SortablePlacement
}

/**
 * 解析拖拽落点
 *
 * dnd-kit 的 `operation.target` 始终指向拖拽体自身,落点要从 sortable 的实时状态读取:
 * `group` 是落点分组,`index` 是拖拽项在新列表中的下标;
 * 同组内向下移动时拖拽项自身占位会让下标多算一位,需要抵消。
 *
 * @param source 拖拽源
 * @returns 落点分组与插入锚点(插到该卡片之前,为空表示追加到分组末尾),无法识别时返回 null
 */
function resolveDropTarget(source: unknown): TaskDropTarget | null {
  const placement = toSortablePlacement(source)
  if (!placement) return null

  const status = resolveGroupStatus(placement.group)
  if (status === undefined) return null

  const group = groupItems.value[getTaskGroupId(status)] ?? []
  const offset =
    placement.initialGroup === placement.group &&
    placement.initialIndex < placement.index
      ? 1
      : 0
  const anchor = group[placement.index + offset]

  return { status, beforeId: anchor?.id ?? null }
}

/** 拖拽期间读取落位的帧句柄,保证同一帧只处理一次 */
let placeholderFrame = 0

/** 当前被标记为落位占位的卡片 */
let dropPlaceholder: HTMLElement | null = null

/** 当前被标记为分组落位的分组容器 */
let groupPlaceholderHost: HTMLElement | null = null

/**
 * 在分组容器末尾显示合成占位盒子
 *
 * 拖拽悬停在分组空白处(分组末尾、空分组)时落点是分组容器,
 * 在容器上打标记,由 Group 组件模板中的占位盒子显示落位虚线框。
 *
 * @param target 分组容器对应的 droppable
 * @param source 拖拽源,用于取占位盒子高度
 */
function markGroupPlaceholder(
  target: DragMoveEvent['operation']['target'],
  source: DragMoveEvent['operation']['source']
) {
  const element = target?.element
  const host = element instanceof HTMLElement ? element : null
  if (host === groupPlaceholderHost) return

  clearDropPlaceholder()
  if (!host) return

  const sourceElement = source?.element
  if (sourceElement instanceof HTMLElement) {
    host.style.setProperty(
      '--task-drop-placeholder-height',
      `${sourceElement.getBoundingClientRect().height}px`
    )
  }
  host.setAttribute('data-w-draggable-group-over', 'true')
  groupPlaceholderHost = host
}

/** 移除分组容器上的合成占位标记 */
function clearGroupPlaceholder() {
  if (!groupPlaceholderHost) return
  groupPlaceholderHost.removeAttribute('data-w-draggable-group-over')
  groupPlaceholderHost.style.removeProperty('--task-drop-placeholder-height')
  groupPlaceholderHost = null
}

/**
 * 标记落位占位
 *
 * dnd-kit 拖拽时会同时渲染悬浮预览和列表里的占位卡片,这里根据落点标记占位:
 * - 悬停在分组空白处时,落点是分组容器,在容器末尾显示合成占位盒子;
 * - 悬停在卡片上时,把 dnd-kit 留在列表中的占位克隆标记成落位卡片。
 *
 * 标记直接写 DOM 属性,不走响应式状态,避免拖拽期间重渲染卡片列表
 * 与 dnd-kit 的乐观排序相互干扰。
 *
 * @param event 拖拽中事件
 */
function markDropPlaceholder(event: DragMoveEvent) {
  const { source } = event.operation
  // 分组拖拽不涉及卡片落位占位
  if (source?.type === 'task-stage') {
    clearDropPlaceholder()
    return
  }
  if (placeholderFrame) return

  // dnd-kit 在派发 dragmove 之后才应用本次移动,延后一帧读取才是最新位置
  placeholderFrame = requestAnimationFrame(() => {
    placeholderFrame = 0

    const { target } = event.operation
    // 不在任何放置区域内时清掉占位标记
    if (!target) {
      clearDropPlaceholder()
      return
    }

    // 悬停在分组空白处:分组末尾显示合成占位盒子
    if (resolveGroupStatus(target.id) !== undefined) {
      markGroupPlaceholder(target, source)
      return
    }
    clearGroupPlaceholder()

    if (typeof source?.id !== 'number') return

    const candidates = document.querySelectorAll<HTMLElement>(
      `.task-card-item[data-w-draggable-id="${source.id}"]`
    )
    // 悬浮预览是 fixed 定位,留在列表中的那个才是占位卡片
    const placeholder = [...candidates].find(
      (element) => getComputedStyle(element).position !== 'fixed'
    )
    if (placeholder === dropPlaceholder) return

    clearDropPlaceholder()
    placeholder?.setAttribute('data-w-draggable-over', 'true')
    dropPlaceholder = placeholder ?? null
  })
}

function clearDropPlaceholder() {
  if (placeholderFrame) {
    cancelAnimationFrame(placeholderFrame)
    placeholderFrame = 0
  }
  dropPlaceholder?.removeAttribute('data-w-draggable-over')
  dropPlaceholder = null
  clearGroupPlaceholder()
}

onBeforeUnmount(clearDropPlaceholder)

function handleDragEnd(event: DragEndEvent) {
  const source = event.operation.source
  const id = source?.id
  if (event.canceled) {
    clearDropPlaceholder()
    return
  }

  // 分组拖拽:按 sortable 的首尾下标调整分组顺序
  if (source?.type === 'task-stage') {
    clearDropPlaceholder()
    const placement = toSortablePlacement(source)
    if (placement) moveStage(placement.initialIndex, placement.index)
    return
  }

  if (typeof id !== 'number') {
    clearDropPlaceholder()
    return
  }

  // 落在分组空白处时 target 是分组容器,直接追加到该分组末尾
  const groupStatus = resolveGroupStatus(event.operation.target?.id)
  const target =
    groupStatus === undefined
      ? resolveDropTarget(source)
      : { status: groupStatus, beforeId: null }

  clearDropPlaceholder()
  // 落回原位时锚点就是自己,不需要上报
  if (!target || target.beforeId === id) return

  emits('move', { id, ...target })
}
</script>
