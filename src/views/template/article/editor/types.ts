import type { ArticleStatus } from '../types'

export interface EditorDocument {
  id: string
  title: string
  summary: string
  content: string
  tags: string[]
  status: ArticleStatus
  updatedAt: string
  createdAt: string
}

export interface EditorVersion {
  id: string
  documentId: string
  title: string
  content: string
  createdAt: string
  wordCount: number
}

export interface EditorComment {
  id: string
  documentId: string
  author: string
  content: string
  createdAt: string
  resolved: boolean
}

export type EditorMode = 'edit' | 'preview' | 'source'
export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export interface OutlineItem {
  id: string
  level: number
  text: string
}

export interface EditorContentExpose {
  getHTML: () => string
  setHTML: (value: string) => void
  insertHTML: (value: string) => void
}
