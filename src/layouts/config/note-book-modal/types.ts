export interface NoteItem {
  id: string
  title: string
  content: string
  pinned: boolean
  updatedAt: string
}

export interface NotebookStorage {
  read: () => NoteItem[]
  write: (items: readonly NoteItem[]) => void
}
