import type { ReportDocument } from '../types'
import { migrateDocument } from '../core/schema/document'

const STORAGE_KEY = 'wuhu-report-designer:workbooks:v3'
const LEGACY_KEY = 'wuhu-report-designer:workbooks:v2'
const MAX_PUBLISHED = 20

export interface PublishedDocument {
  id: string
  name: string
  publishedAt: string
  document: ReportDocument
}

interface StoredState {
  drafts: ReportDocument[]
  published: PublishedDocument[]
}

function emptyState(): StoredState {
  return { drafts: [], published: [] }
}

function readState(): StoredState {
  if (typeof localStorage === 'undefined') return emptyState()
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<StoredState>
      return {
        drafts: Array.isArray(parsed.drafts)
          ? parsed.drafts
              .map((item) => migrateDocument(item))
              .filter((item): item is ReportDocument => Boolean(item))
          : [],
        published: Array.isArray(parsed.published)
          ? parsed.published.filter(
              (item): item is PublishedDocument =>
                Boolean(item) &&
                typeof item.id === 'string' &&
                Boolean(item.document)
            )
          : [],
      }
    } catch {
      return emptyState()
    }
  }
  return readLegacyState()
}

function readLegacyState(): StoredState {
  const raw = localStorage.getItem(LEGACY_KEY)
  if (!raw) return emptyState()
  try {
    const parsed = JSON.parse(raw) as {
      drafts?: unknown[]
      published?: Array<{
        id?: string
        name?: string
        publishedAt?: string
        workbook?: unknown
      }>
    }
    return {
      drafts: (parsed.drafts ?? [])
        .map((item) => migrateDocument(item))
        .filter((item): item is ReportDocument => Boolean(item)),
      published: (parsed.published ?? [])
        .map((item) => {
          const document = migrateDocument(item.workbook)
          if (!document) return undefined
          return {
            id: typeof item.id === 'string' ? item.id : document.workbook.id,
            name:
              typeof item.name === 'string'
                ? item.name
                : document.workbook.name,
            publishedAt:
              typeof item.publishedAt === 'string'
                ? item.publishedAt
                : new Date().toISOString(),
            document,
          }
        })
        .filter((item): item is PublishedDocument => Boolean(item)),
    }
  } catch {
    return emptyState()
  }
}

function writeState(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function listDrafts() {
  return readState().drafts
}

export function saveDraft(document: ReportDocument) {
  const state = readState()
  const id = document.workbook.id
  const index = state.drafts.findIndex((item) => item.workbook.id === id)
  if (index >= 0) state.drafts[index] = document
  else state.drafts.unshift(document)
  writeState(state)
}

export function removeDraft(id: string) {
  const state = readState()
  state.drafts = state.drafts.filter((item) => item.workbook.id !== id)
  writeState(state)
}

export function listPublished() {
  return readState().published
}

export function publishDocument(document: ReportDocument) {
  const state = readState()
  const snapshot: PublishedDocument = {
    id: document.workbook.id,
    name: document.workbook.name,
    publishedAt: new Date().toISOString(),
    document: structuredClone(document),
  }
  state.published = [
    snapshot,
    ...state.published.filter((item) => item.id !== snapshot.id),
  ].slice(0, MAX_PUBLISHED)
  writeState(state)
  return snapshot
}

export function restoreDocument(id: string) {
  const state = readState()
  const published = state.published.find((item) => item.id === id)
  if (!published) return undefined
  return structuredClone(published.document)
}

export function getStorageError() {
  try {
    const probe = '__wuhu_report_probe__'
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return undefined
  } catch {
    return '浏览器本地存储不可用,自动保存已关闭'
  }
}
