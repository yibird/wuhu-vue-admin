import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { GanttContextMenuEvent, GanttTask } from '@/components/gantt'
import type { Task } from '../types'
import { getContextMenuPosition, type TaskGanttMenuPosition } from './utils'

export function useTaskGanttContextMenu(
  resolveTask: (task: GanttTask) => Task | null
) {
  const contextMenuOpen = shallowRef(false)
  const contextMenuTask = shallowRef<Task | null>(null)
  const contextMenuPosition = shallowRef<TaskGanttMenuPosition>({ x: 0, y: 0 })

  function openContextMenu(payload: GanttContextMenuEvent) {
    const task = resolveTask(payload.task)
    if (!task) return null

    contextMenuTask.value = task
    contextMenuPosition.value = getContextMenuPosition(payload.x, payload.y)
    contextMenuOpen.value = true
    return task
  }

  function closeContextMenu() {
    contextMenuOpen.value = false
  }

  function handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeContextMenu()
    }
  }

  onMounted(() => {
    document.addEventListener('click', closeContextMenu)
    document.addEventListener('keydown', handleDocumentKeydown)
    window.addEventListener('scroll', closeContextMenu, true)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', closeContextMenu)
    document.removeEventListener('keydown', handleDocumentKeydown)
    window.removeEventListener('scroll', closeContextMenu, true)
  })

  return {
    closeContextMenu,
    contextMenuOpen,
    contextMenuPosition,
    contextMenuTask,
    openContextMenu,
  }
}
