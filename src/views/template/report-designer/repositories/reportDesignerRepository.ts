import { defaultDataSourceConfig } from '../data'
import { sanitizeDataSourceConfig, sanitizeDataSources } from '../schema'

import type {
  DataSourceConfig,
  ReportDataSourceItem,
  ReportTemplateSnapshot,
} from '../types'

export const defaultSourceId = 'sample-orders'
export const maxTemplateCount = 20

const sourceStorageKey = 'wuhu-report-designer-data-sources'
const templateStorageKey = 'wuhu-report-designer-templates'
const maxDataSourceCount = 30

export function cloneSourceConfig(config: Partial<DataSourceConfig>) {
  return { ...defaultDataSourceConfig, ...config }
}

function createDefaultDataSourceItem(): ReportDataSourceItem {
  return {
    config: cloneSourceConfig(defaultDataSourceConfig),
    id: defaultSourceId,
    kind: 'sample',
    name: defaultDataSourceConfig.name,
    savedAt: '',
  }
}

function canUseStorage() {
  return typeof window !== 'undefined' && !!window.localStorage
}

export function normalizeDataSources(sources: ReportDataSourceItem[]) {
  const seenIds = new Set<string>()
  const nextSources = [createDefaultDataSourceItem(), ...sources]
    .map((source) => {
      const config = cloneSourceConfig(source.config)
      return {
        ...source,
        config,
        id:
          source.id ||
          `source-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind: config.kind,
        name: source.name?.trim() || config.name || '未命名数据源',
      }
    })
    .filter((source) => {
      if (seenIds.has(source.id)) return false
      seenIds.add(source.id)
      return true
    })

  return nextSources.slice(0, maxDataSourceCount)
}

export function readTemplates() {
  if (!canUseStorage()) return []
  try {
    const value = window.localStorage.getItem(templateStorageKey)
    if (!value) return []
    const payload: unknown = JSON.parse(value)
    if (!Array.isArray(payload)) return []
    return (payload as ReportTemplateSnapshot[]).map((template) => ({
      ...template,
      sourceConfig: sanitizeDataSourceConfig(template.sourceConfig),
    }))
  } catch {
    return []
  }
}

export function readDataSources() {
  if (!canUseStorage()) return normalizeDataSources([])
  try {
    const value = window.localStorage.getItem(sourceStorageKey)
    if (!value) return normalizeDataSources([])
    const payload: unknown = JSON.parse(value)
    return sanitizeDataSources(
      normalizeDataSources(
        Array.isArray(payload) ? (payload as ReportDataSourceItem[]) : []
      )
    )
  } catch {
    return normalizeDataSources([])
  }
}

export function persistTemplates(templates: ReportTemplateSnapshot[]) {
  if (!canUseStorage()) return
  const safeTemplates = templates.map((template) => ({
    ...template,
    sourceConfig: sanitizeDataSourceConfig(template.sourceConfig),
  }))
  window.localStorage.setItem(templateStorageKey, JSON.stringify(safeTemplates))
}

export function persistDataSources(sources: ReportDataSourceItem[]) {
  if (!canUseStorage()) return
  window.localStorage.setItem(
    sourceStorageKey,
    JSON.stringify(sanitizeDataSources(sources))
  )
}
