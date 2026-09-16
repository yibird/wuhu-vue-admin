import { cloneDeep } from 'es-toolkit'
import { computed, shallowRef } from 'vue'

import type { WorkflowJsonSchema } from '../types'

interface UseWorkflowHistoryOptions {
  getSnapshot: () => WorkflowJsonSchema
  restoreSnapshot: (schema: WorkflowJsonSchema) => void
  limit?: number
}

function cloneSchema(schema: WorkflowJsonSchema) {
  return cloneDeep(schema)
}

export function useWorkflowHistory({
  getSnapshot,
  restoreSnapshot,
  limit = 50,
}: UseWorkflowHistoryOptions) {
  const past = shallowRef<WorkflowJsonSchema[]>([])
  const future = shallowRef<WorkflowJsonSchema[]>([])
  const canUndo = computed(() => past.value.length > 0)
  const canRedo = computed(() => future.value.length > 0)

  function record() {
    past.value = [...past.value, cloneSchema(getSnapshot())].slice(-limit)
    future.value = []
  }

  function undo() {
    const previous = past.value.at(-1)
    if (!previous) return
    past.value = past.value.slice(0, -1)
    future.value = [cloneSchema(getSnapshot()), ...future.value].slice(0, limit)
    restoreSnapshot(cloneSchema(previous))
  }

  function redo() {
    const [next, ...remaining] = future.value
    if (!next) return
    future.value = remaining
    past.value = [...past.value, cloneSchema(getSnapshot())].slice(-limit)
    restoreSnapshot(cloneSchema(next))
  }

  function clear() {
    past.value = []
    future.value = []
  }

  return { canRedo, canUndo, clear, future, past, record, redo, undo }
}
