import type {
  DataSourceConfig,
  ReportDataSourceItem,
  ReportDesignerSchema,
} from './types'

export const REPORT_SCHEMA_VERSION = 1

const SENSITIVE_DATA_SOURCE_FIELDS = [
  'headers',
  'body',
  'rawJson',
  'sqlPassword',
  'sqlUsername',
] as const

type RecordValue = Record<string, unknown>

function isRecord(value: unknown): value is RecordValue {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function readSchemaVersion(value: RecordValue) {
  return typeof value.schemaVersion === 'number' ? value.schemaVersion : 0
}

export function sanitizeDataSourceConfig(
  config: DataSourceConfig
): DataSourceConfig {
  const sanitized = { ...config }
  for (const field of SENSITIVE_DATA_SOURCE_FIELDS) sanitized[field] = ''
  return sanitized
}

export function sanitizeDataSourceItem(
  source: ReportDataSourceItem
): ReportDataSourceItem {
  return {
    ...source,
    config: sanitizeDataSourceConfig(source.config),
  }
}

export function sanitizeDataSources(sources: ReportDataSourceItem[]) {
  return sources.map(sanitizeDataSourceItem)
}

export function migrateReportSchema(value: unknown): RecordValue {
  if (!isRecord(value)) throw new Error('Schema 必须是 JSON 对象')

  const version = readSchemaVersion(value)
  if (version > REPORT_SCHEMA_VERSION) {
    throw new Error(`不支持的 Schema 版本：${version}`)
  }

  // Version 0 is the original unversioned export format.
  return version === 0
    ? { ...value, schemaVersion: REPORT_SCHEMA_VERSION }
    : { ...value }
}

export function parseReportSchema(value: string): ReportDesignerSchema {
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch {
    throw new Error('Schema 不是有效的 JSON')
  }

  const migrated = migrateReportSchema(parsed)
  if (!Array.isArray(migrated.fields) || migrated.fields.length === 0) {
    throw new Error('Schema fields 必须是非空数组')
  }
  if (!isRecord(migrated.settings)) {
    throw new Error('Schema settings 必须是对象')
  }
  if (
    migrated.dataSources !== undefined &&
    (!Array.isArray(migrated.dataSources) ||
      migrated.dataSources.some((source) => !isRecord(source)))
  ) {
    throw new Error('Schema dataSources 格式不正确')
  }

  return migrated as unknown as ReportDesignerSchema
}
