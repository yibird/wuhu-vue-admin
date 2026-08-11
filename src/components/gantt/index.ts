export { default as Gantt } from './src/index.vue'
export type {
  GanttContextMenuEvent,
  GanttProps,
  GanttTask,
  GanttViewMode,
  GanttViewModeDefinition,
} from './src/types'
export { createGanttTaskSignature, normalizeGanttTasks } from './src/utils'
