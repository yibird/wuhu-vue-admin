import type { ChartDataRecord, ChartDataSource } from '../types'
import { createDesignerId } from './ids'
import { inferFields } from './schema'

export interface JsonSourceImportResult {
  records: ChartDataRecord[]
  source: ChartDataSource
}

export function createJsonSourceFromDraft(
  jsonDraft: string,
  updatedAt: string
): JsonSourceImportResult | undefined {
  const parsed = JSON.parse(jsonDraft) as unknown
  const records = normalizeRecords(parsed)

  if (!records) return undefined

  return {
    records,
    source: {
      description: '从本地 JSON 快速导入，适合验证图表原型。',
      endpoint: 'local://json-draft',
      fields: inferFields(records),
      id: createDesignerId('json'),
      kind: 'json',
      name: '导入 JSON 数据源',
      records,
      refreshInterval: 0,
      status: 'online',
      updatedAt,
    },
  }
}

function normalizeRecords(parsed: unknown): ChartDataRecord[] | undefined {
  if (Array.isArray(parsed) && parsed.every(isChartDataRecord)) return parsed
  if (isChartDataRecord(parsed)) return [parsed]

  return undefined
}

function isChartDataRecord(value: unknown): value is ChartDataRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(isChartDataValue)
  )
}

function isChartDataValue(value: unknown): value is ChartDataRecord[string] {
  return (
    value === null ||
    value === undefined ||
    ['boolean', 'number', 'string'].includes(typeof value)
  )
}
