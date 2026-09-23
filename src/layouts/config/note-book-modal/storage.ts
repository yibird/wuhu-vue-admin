import type { NoteItem, NotebookStorage } from './types'

const storageKey = 'wuhu-note-book-items'

function isNoteItem(value: unknown): value is NoteItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.content === 'string' &&
    typeof item.pinned === 'boolean' &&
    typeof item.updatedAt === 'string'
  )
}

export function createNotebookStorage(): NotebookStorage {
  return {
    read() {
      if (typeof window === 'undefined') return []
      try {
        const rawValue = window.localStorage.getItem(storageKey)
        if (!rawValue) return []
        const payload: unknown = JSON.parse(rawValue)
        return Array.isArray(payload) ? payload.filter(isNoteItem) : []
      } catch {
        return []
      }
    },
    write(items) {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(storageKey, JSON.stringify(items))
    },
  }
}
