import { computed, shallowRef } from 'vue'
import dayjs from 'dayjs'
import { createNotebookStorage } from '../storage'

import type { NoteItem, NotebookStorage } from '../types'

function createId() {
  return `note-${crypto.randomUUID()}`
}

function createDefaultNotes(): NoteItem[] {
  const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return [
    {
      id: createId(),
      title: '今日跟进',
      content: '客户转化报表导出后，核对华南区发票归档与活动素材下载状态。',
      pinned: true,
      updatedAt,
    },
    {
      id: createId(),
      title: '发布检查',
      content: '确认任务中心、下载中心、记事本入口在顶部工具栏都可打开。',
      pinned: false,
      updatedAt,
    },
  ]
}

export function useNotebook(
  storage: NotebookStorage = createNotebookStorage()
) {
  const storedNotes = storage.read()
  const notes = shallowRef<NoteItem[]>(
    storedNotes.length ? storedNotes : createDefaultNotes()
  )
  const activeId = shallowRef(notes.value[0]?.id ?? '')
  const keyword = shallowRef('')

  const sortedNotes = computed(() => {
    return [...notes.value].sort((left, right) => {
      if (left.pinned !== right.pinned) return left.pinned ? -1 : 1
      return dayjs(right.updatedAt).valueOf() - dayjs(left.updatedAt).valueOf()
    })
  })

  const filteredNotes = computed(() => {
    const value = keyword.value.trim().toLowerCase()
    if (!value) return sortedNotes.value
    return sortedNotes.value.filter((note) =>
      `${note.title} ${note.content}`.toLowerCase().includes(value)
    )
  })

  const activeNote = computed(() => {
    return (
      notes.value.find((note) => note.id === activeId.value) ??
      filteredNotes.value[0] ??
      null
    )
  })

  const noteCountLabel = computed(() => {
    const pinnedCount = notes.value.filter((note) => note.pinned).length
    return `${notes.value.length} 条笔记 · ${pinnedCount} 条置顶`
  })

  function persist(items: NoteItem[]) {
    notes.value = items
    storage.write(items)
  }

  function updateNote(id: string, patch: Partial<NoteItem>) {
    const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
    persist(
      notes.value.map((note) =>
        note.id === id ? { ...note, ...patch, updatedAt } : note
      )
    )
  }

  function addNote() {
    const note: NoteItem = {
      id: createId(),
      title: '未命名笔记',
      content: '',
      pinned: false,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    }
    persist([note, ...notes.value])
    activeId.value = note.id
  }

  function selectNote(id: string) {
    activeId.value = id
  }

  function togglePin(note: NoteItem) {
    updateNote(note.id, { pinned: !note.pinned })
  }

  function deleteNote(note: NoteItem) {
    persist(notes.value.filter((item) => item.id !== note.id))
    activeId.value = filteredNotes.value[0]?.id ?? notes.value[0]?.id ?? ''
  }

  return {
    activeId,
    activeNote,
    filteredNotes,
    keyword,
    noteCountLabel,
    addNote,
    deleteNote,
    selectNote,
    togglePin,
    updateNote,
  }
}
