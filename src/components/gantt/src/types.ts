import type {
  FrappeGanttOptions,
  FrappeGanttTask,
  FrappeGanttViewMode,
  FrappeGanttViewModeDefinition,
} from 'frappe-gantt'

export type GanttViewMode = FrappeGanttViewMode
export type GanttViewModeDefinition = FrappeGanttViewModeDefinition

export interface GanttTask extends FrappeGanttTask {
  id: string
  name: string
  start: string
  end: string
  progress: number
  dependencies?: string[]
  custom_class?: string
  description?: string
}

export interface GanttContextMenuEvent {
  readonly task: GanttTask
  readonly nativeEvent: MouseEvent
  readonly x: number
  readonly y: number
}

export interface GanttProps {
  tasks: GanttTask[]
  viewMode?: GanttViewMode
  options?: FrappeGanttOptions
  readonly?: boolean
  autoresize?: boolean
  emptyText?: string
}

export interface GanttEmits {
  click: [task: GanttTask]
  doubleClick: [task: GanttTask]
  dateChange: [task: GanttTask, start: Date, end: Date]
  progressChange: [task: GanttTask, progress: number]
  viewChange: [mode: GanttViewModeDefinition]
  dateClick: [date: string | null]
  contextMenu: [payload: GanttContextMenuEvent]
}
