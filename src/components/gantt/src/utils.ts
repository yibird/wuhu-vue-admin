import type { FrappeGanttTask } from 'frappe-gantt'
import type { GanttTask } from './types'

export function normalizeGanttTasks(
  tasks: readonly GanttTask[]
): FrappeGanttTask[] {
  return tasks.map((task) => ({
    ...task,
    id: String(task.id),
    dependencies: Array.isArray(task.dependencies)
      ? task.dependencies.join(', ')
      : task.dependencies,
  }))
}

/**
 * Frappe Gantt 会修改传入任务，签名必须基于调用方原始数据生成。
 * JSON 序列化覆盖 custom_class、description 和业务扩展字段，避免漏刷新。
 */
export function createGanttTaskSignature(tasks: readonly GanttTask[]) {
  return JSON.stringify(tasks)
}
