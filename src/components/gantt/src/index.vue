<script lang="ts" setup>
import Gantt from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'
import { createGanttTaskSignature, normalizeGanttTasks } from './utils'
import type { GanttProps, GanttEmits, GanttTask } from './types'
import type {
  FrappeGanttOptions,
  FrappeGanttTask,
  FrappeGanttViewModeDefinition,
} from 'frappe-gantt'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GanttProps>(), {
  tasks: () => [],
  viewMode: 'Week',
  readonly: false,
  autoresize: true,
  emptyText: '暂无甘特图数据',
  options: () => ({}),
})

const emit = defineEmits<GanttEmits>()

const ganttRef = useTemplateRef<HTMLDivElement>('ganttRef')
const ganttInstance = shallowRef<Gantt | null>(null)
let lastTaskSignature = ''
let lastViewMode = props.viewMode

function createGanttOptions(): FrappeGanttOptions {
  return {
    language: 'zh',
    scroll_to: 'start',
    infinite_padding: false,
    lines: 'both',
    popup: false,
    ...props.options,
    view_mode: props.viewMode,
    readonly: props.readonly,
    readonly_dates: props.readonly,
    readonly_progress: props.readonly,
    on_click: (task: FrappeGanttTask) => {
      emit('click', task as GanttTask)
      props.options?.on_click?.(task)
    },
    on_double_click: (task: FrappeGanttTask) => {
      emit('doubleClick', task as GanttTask)
      props.options?.on_double_click?.(task)
    },
    on_date_change: (task: FrappeGanttTask, start: Date, end: Date) => {
      emit('dateChange', task as GanttTask, start, end)
      props.options?.on_date_change?.(task, start, end)
    },
    on_progress_change: (task: FrappeGanttTask, progress: number) => {
      emit('progressChange', task as GanttTask, progress)
      props.options?.on_progress_change?.(task, progress)
    },
    on_view_change: (mode: FrappeGanttViewModeDefinition) => {
      emit('viewChange', mode)
      props.options?.on_view_change?.(mode)
    },
    on_date_click: (date: string | null) => {
      emit('dateClick', date)
      props.options?.on_date_click?.(date)
    },
  }
}

function initGantt() {
  if (!ganttRef.value || props.tasks.length === 0) return

  ganttInstance.value = new Gantt(
    ganttRef.value,
    normalizeGanttTasks(props.tasks),
    createGanttOptions()
  )
  lastTaskSignature = createGanttTaskSignature(props.tasks)
  lastViewMode = props.viewMode
}

function handleContextMenu(event: MouseEvent) {
  if (!ganttInstance.value) return

  const targetElement = event.target instanceof Element ? event.target : null
  const pointElement = document.elementFromPoint(event.clientX, event.clientY)
  const wrapper =
    targetElement?.closest('.bar-wrapper') ??
    pointElement?.closest('.bar-wrapper')
  const taskId = wrapper?.getAttribute('data-id')

  if (!taskId) return

  const task = ganttInstance.value.tasks.find(
    (currentTask) => String(currentTask.id) === taskId
  )
  if (!task) return

  event.preventDefault()
  emit('contextMenu', {
    task: task as GanttTask,
    nativeEvent: event,
    x: event.clientX,
    y: event.clientY,
  })
}

function handleContextMouseDown(event: MouseEvent) {
  const isContextGesture =
    event.button === 2 || (event.button === 0 && event.ctrlKey)
  if (!isContextGesture) return
  handleContextMenu(event)
}

watch(
  () => props.tasks,
  (newTasks) => {
    if (newTasks.length === 0) {
      lastTaskSignature = ''
      if (ganttInstance.value) {
        ganttInstance.value.hide_popup()
        ganttInstance.value = null
      }
      if (ganttRef.value) {
        ganttRef.value.innerHTML = ''
      }
      return
    }

    const signature = createGanttTaskSignature(newTasks)
    if (signature === lastTaskSignature) return
    lastTaskSignature = signature

    if (ganttInstance.value) {
      ganttInstance.value.refresh(normalizeGanttTasks(newTasks))
    } else {
      initGantt()
    }
  }
)

watch(
  () => props.viewMode,
  (newMode) => {
    if (ganttInstance.value && newMode && newMode !== lastViewMode) {
      lastViewMode = newMode
      ganttInstance.value.change_view_mode(newMode)
    }
  }
)

watch(
  () => [props.options, props.readonly],
  () => {
    ganttInstance.value?.update_options(createGanttOptions())
  }
)

let resizeObserver: ResizeObserver | null = null
let resizeFrameId: number | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let lastObservedWidth = 0

function cancelResizeRefresh() {
  if (resizeTimer !== null) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }
  if (resizeFrameId !== null) {
    window.cancelAnimationFrame(resizeFrameId)
    resizeFrameId = null
  }
}

function scheduleResizeRefresh(delay = 120) {
  if (resizeTimer !== null) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    resizeTimer = null
    resizeFrameId = window.requestAnimationFrame(() => {
      resizeFrameId = null
      const width = ganttRef.value?.clientWidth ?? 0
      if (!width || Math.abs(width - lastObservedWidth) < 1) return
      lastObservedWidth = width
      ganttInstance.value?.change_view_mode(props.viewMode, true)
    })
  }, delay)
}

function observeSize() {
  if (!props.autoresize || !ganttRef.value || resizeObserver) return
  resizeObserver = new ResizeObserver(() => scheduleResizeRefresh())
  resizeObserver.observe(ganttRef.value)
}

function stopObservingSize() {
  resizeObserver?.disconnect()
  resizeObserver = null
  cancelResizeRefresh()
}

onMounted(() => {
  initGantt()

  observeSize()
})

onActivated(() => {
  lastObservedWidth = 0
  observeSize()
  scheduleResizeRefresh(0)
})

onDeactivated(() => {
  stopObservingSize()
  ganttInstance.value?.hide_popup()
})

onUnmounted(() => {
  stopObservingSize()
  if (ganttInstance.value) {
    ganttInstance.value.hide_popup()
    ganttInstance.value = null
  }
  if (ganttRef.value) ganttRef.value.innerHTML = ''
})
</script>

<template>
  <div
    class="relative full min-h-0 overflow-hidden rounded-4 border-1 border-color-2 border-solid bg-container"
    v-bind="$attrs"
    @contextmenu="handleContextMenu"
    @mousedown="handleContextMouseDown"
  >
    <div ref="ganttRef" class="w-gantt full min-h-0" />
    <div
      v-if="tasks.length === 0"
      class="absolute inset-0 flex items-center justify-center bg-container text-sm text-secondary"
    >
      {{ emptyText }}
    </div>
  </div>
</template>

<style lang="less" scoped src="./styles.less"></style>
