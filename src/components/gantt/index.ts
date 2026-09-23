export type {
  GanttContextMenuEvent,
  GanttProps,
  GanttTask,
  GanttViewMode,
  GanttViewModeDefinition,
} from './src/types'
export { createGanttTaskSignature, normalizeGanttTasks } from './src/utils'

export const Gantt = defineAsyncComponent(() => import('./src/index.vue'))
