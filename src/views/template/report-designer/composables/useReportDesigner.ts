import { computed, reactive, shallowRef } from 'vue'
import {
  defaultDataSourceConfig,
  defaultFields,
  defaultReportSettings,
  sampleRows,
} from '../data'
import { formatFieldValue, testFieldFormatter } from '../formatters'
import {
  expressionHasIdentifier,
  isExpressionIdentifier,
  renameExpressionIdentifier,
} from '../model/expression'
import { useReportDataPipeline } from './useReportDataPipeline'
import {
  cloneSourceConfig,
  defaultSourceId,
  maxTemplateCount,
  normalizeDataSources,
  persistDataSources,
  persistTemplates,
  readDataSources,
  readTemplates,
} from '../repositories/reportDesignerRepository'
import {
  parseReportSchema,
  REPORT_SCHEMA_VERSION,
  sanitizeDataSourceConfig,
  sanitizeDataSourceItem,
} from '../schema'
import type {
  DataSourceConfig,
  ExportFormat,
  FieldType,
  ReportDataSourceItem,
  ReportDesignerSchema,
  ReportField,
  ReportFieldMappingItem,
  ReportFilter,
  ReportRow,
  ReportSettings,
  ReportSort,
  ReportTemplateSnapshot,
} from '../types'

const currencyKeys = ['amount', 'price', 'cost', 'fee', 'revenue', 'sales']
const percentKeys = ['rate', 'ratio', 'percent', 'margin']
const dateKeys = ['date', 'time', 'created', 'updated']
const exportThemeTokens: Record<
  ReportSettings['theme'],
  { headerBackground: string; headerColor: string }
> = {
  amber: { headerBackground: '#b45309', headerColor: '#fff' },
  default: { headerBackground: 'transparent', headerColor: '#111827' },
  ink: { headerBackground: '#111827', headerColor: '#fff' },
  steel: { headerBackground: '#2563eb', headerColor: '#fff' },
  teal: { headerBackground: '#0f766e', headerColor: '#fff' },
}

function cloneFields(fields: ReportField[] = []) {
  return fields.map((field) => ({
    ...field,
    format: field.format ? { ...field.format } : undefined,
    mappingItems: field.mappingItems?.map((item) => ({ ...item })),
  }))
}

function cloneFilters(filters: ReportFilter[] = []) {
  return filters.map((filter) => ({ ...filter }))
}

function cloneSorts(sorts: ReportSort[] = []) {
  return sorts.map((sort) => ({ ...sort }))
}

function cloneRows(rows: ReportRow[]) {
  return rows.map((row) => ({ ...row }))
}

function toTitle(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^\w/, (letter) => letter.toUpperCase())
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function normalizeRows(value: unknown): ReportRow[] {
  if (!Array.isArray(value)) {
    return isPlainRecord(value) ? [value as ReportRow] : []
  }

  return value
    .map((item) => {
      if (isPlainRecord(item)) return item as ReportRow
      return { value: String(item) }
    })
    .filter((item) => Object.keys(item).length > 0)
}

function pickDataByPath(payload: unknown, path: string) {
  if (!path.trim()) return payload

  return path
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<unknown>((current, part) => {
      if (!isPlainRecord(current)) return undefined
      return current[part]
    }, payload)
}

function resolveRowsFromPayload(payload: unknown, path: string) {
  const explicitRows = normalizeRows(pickDataByPath(payload, path))
  if (explicitRows.length) return explicitRows

  if (!isPlainRecord(payload)) return normalizeRows(payload)

  for (const key of ['data', 'list', 'items', 'records', 'rows']) {
    const rows = normalizeRows(payload[key])
    if (rows.length) return rows
  }

  return normalizeRows(payload)
}

function detectFieldType(key: string, values: unknown[]): FieldType {
  const normalizedKey = key.toLowerCase()
  const meaningfulValues = values.filter(
    (value) => value !== null && value !== undefined
  )

  if (percentKeys.some((part) => normalizedKey.includes(part))) return 'percent'
  if (currencyKeys.some((part) => normalizedKey.includes(part)))
    return 'currency'
  if (dateKeys.some((part) => normalizedKey.includes(part))) return 'date'

  if (
    meaningfulValues.length > 0 &&
    meaningfulValues.every((value) => typeof value === 'number')
  ) {
    return 'number'
  }

  return 'string'
}

function inferFields(rows: ReportRow[], previousFields: ReportField[]) {
  const previousBaseFields = previousFields.filter((field) => !field.computed)
  const previousMap = new Map(
    previousBaseFields.map((field) => [field.key, field])
  )
  const keys = Array.from(
    rows.slice(0, 20).reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key))
      return set
    }, new Set<string>())
  )

  return keys.map((key) => {
    const previous = previousMap.get(key)
    if (previous) return { ...previous }

    const values = rows.slice(0, 30).map((row) => row[key])
    const type = detectFieldType(key, values)
    const isNumberLike = ['number', 'currency', 'percent'].includes(type)

    return {
      key,
      label: toTitle(key),
      type,
      enabled: true,
      width: type === 'string' ? 150 : 110,
      align: isNumberLike ? 'right' : 'left',
      summary: isNumberLike ? 'sum' : 'none',
    } satisfies ReportField
  })
}

function escapeCsv(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

function escapeHtml(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value)
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function sanitizeFileName(value: string) {
  const cleanName = value.trim().replace(/[\\/:*?"<>|]/g, '-')
  return cleanName || 'report-export'
}

function clampPrintMargin(value: number) {
  if (!Number.isFinite(value)) return 16
  return Math.min(Math.max(value, 0), 50)
}

function getPrintPageSize(settings: ReportSettings) {
  const pageSize =
    settings.paperSize === 'label100x150' ? '100mm 150mm' : settings.paperSize
  return `${pageSize} ${settings.orientation}`
}

function getPrintMargins(settings: ReportSettings) {
  return [
    clampPrintMargin(settings.marginTop),
    clampPrintMargin(settings.marginRight),
    clampPrintMargin(settings.marginBottom),
    clampPrintMargin(settings.marginLeft),
  ]
    .map((value) => `${value}mm`)
    .join(' ')
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function sanitizeFieldKey(value: string) {
  const key = value
    .trim()
    .replace(/[^A-Za-z0-9_$]/g, '_')
    .replace(/_+/g, '_')
  if (!key) return ''
  return /^\d/.test(key) ? `field_${key}` : key
}

function renameRawRowKey(row: ReportRow, currentKey: string, nextKey: string) {
  if (!Object.prototype.hasOwnProperty.call(row, currentKey)) return { ...row }

  const { [currentKey]: value, ...rest } = row
  return { ...rest, [nextKey]: value }
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function parseKeyValueText(value: string): Record<string, string> {
  const text = value.trim()
  if (!text) return {}

  try {
    const payload = JSON.parse(text)
    if (isPlainRecord(payload)) {
      return Object.fromEntries(
        Object.entries(payload)
          .filter(([key]) => key.trim())
          .map(([key, nextValue]) => [key.trim(), String(nextValue ?? '')])
      )
    }
  } catch {
    // Fall back to line based key-value parsing.
  }

  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const equalIndex = line.indexOf('=')
        const colonIndex = line.indexOf(':')
        const separatorIndex =
          equalIndex < 0
            ? colonIndex
            : colonIndex < 0
              ? equalIndex
              : Math.min(equalIndex, colonIndex)
        if (separatorIndex <= 0) return ['', '']
        return [
          line.slice(0, separatorIndex).trim(),
          line.slice(separatorIndex + 1).trim(),
        ]
      })
      .filter(([key]) => key)
  )
}

function inferParametersFromConfig(
  config: DataSourceConfig
): ReportDesignerSchema['parameters'] {
  const keys = new Set<string>()

  Object.keys(parseKeyValueText(config.queryParams)).forEach((key) =>
    keys.add(key)
  )

  const sourceText = [config.endpoint, config.body, config.sqlText].join('\n')
  for (const match of sourceText.matchAll(
    /[:{]([A-Za-z_$][A-Za-z0-9_$]*)}?/g
  )) {
    const key = match[1]
    if (key && !['http', 'https'].includes(key)) keys.add(key)
  }

  return Array.from(keys).map((key) => ({
    defaultValue: '',
    id: `param-${key}`,
    key,
    label: toTitle(key),
    required: false,
    type: 'string',
  }))
}

function normalizeMappingKey(value: unknown) {
  return value === null || value === undefined ? '' : String(value).trim()
}

function normalizeMappingItems(items: ReportFieldMappingItem[] = []) {
  return items
    .map((item) => ({
      key: item.key.trim(),
      label: item.label.trim(),
    }))
    .filter((item) => item.key)
}

function parseMappingSource(field: ReportField) {
  const source = field.mappingSource?.trim()
  if (!source) return []

  const keyField = field.mappingKeyField?.trim() || 'key'
  const labelField = field.mappingLabelField?.trim() || 'label'

  try {
    const payload = JSON.parse(source)

    if (Array.isArray(payload)) {
      return payload
        .map((item) => {
          if (!isPlainRecord(item)) return undefined
          const key = normalizeMappingKey(
            item[keyField] ?? item.value ?? item.key
          )
          const label = normalizeMappingKey(
            item[labelField] ?? item.label ?? item.name
          )
          return key ? { key, label } : undefined
        })
        .filter((item): item is ReportFieldMappingItem => !!item)
    }

    if (isPlainRecord(payload)) {
      return Object.entries(payload)
        .map(([key, value]) => {
          if (isPlainRecord(value)) {
            return {
              key: normalizeMappingKey(key),
              label: normalizeMappingKey(
                value[labelField] ?? value.label ?? value.name
              ),
            }
          }

          return {
            key: normalizeMappingKey(key),
            label: normalizeMappingKey(value),
          }
        })
        .filter((item) => item.key)
    }
  } catch {
    // Fall back to key=value or key:label lines.
  }

  return Object.entries(parseKeyValueText(source)).map(([key, label]) => ({
    key,
    label,
  }))
}

function buildFieldMappingMap(field: ReportField) {
  if (!field.mappingEnabled) return new Map<string, string>()

  const items =
    field.mappingMode === 'source'
      ? parseMappingSource(field)
      : normalizeMappingItems(field.mappingItems)

  return new Map(items.map((item) => [item.key, item.label]))
}

function appendQueryParams(endpoint: string, paramsText: string) {
  const params = parseKeyValueText(paramsText)
  const entries = Object.entries(params).filter(([key]) => key)
  if (!entries.length) return endpoint

  const url = new URL(endpoint, window.location.origin)
  entries.forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value)
  })

  return url.origin === window.location.origin
    ? `${url.pathname}${url.search}`
    : url.toString()
}

function buildRequestBody(bodyText: string) {
  const text = bodyText.trim()
  if (!text) return undefined

  try {
    return JSON.stringify(JSON.parse(text))
  } catch {
    return text
  }
}

function isJsonBody(bodyText: string) {
  if (!bodyText.trim()) return false

  try {
    JSON.parse(bodyText)
    return true
  } catch {
    return false
  }
}

function buildTableRows(
  rows: ReportRow[],
  fields: ReportField[],
  withIndex: boolean,
  valueFormatter: (
    value: unknown,
    field: ReportField,
    row: ReportRow
  ) => unknown
) {
  return rows.map((row, index) => {
    const cells = fields.map((field) =>
      valueFormatter(row[field.key], field, row)
    )
    return withIndex ? [index + 1, ...cells] : cells
  })
}

export function useReportDesigner() {
  const sourceConfig = reactive<DataSourceConfig>({
    ...defaultDataSourceConfig,
  })
  const settings = reactive<ReportSettings>({ ...defaultReportSettings })
  const fields = shallowRef<ReportField[]>(cloneFields(defaultFields))
  const rawRows = shallowRef<ReportRow[]>(cloneRows(sampleRows))
  const filters = shallowRef<ReportFilter[]>([])
  const sorts = shallowRef<ReportSort[]>([])
  const dataSources = shallowRef<ReportDataSourceItem[]>(readDataSources())
  const activeSourceId = shallowRef(defaultSourceId)
  const templates = shallowRef<ReportTemplateSnapshot[]>(readTemplates())
  const isLoading = shallowRef(false)
  const loadError = shallowRef('')
  const exportStatus = shallowRef('已加载样例数据')
  const templateStatus = shallowRef('模板可保存到当前浏览器')
  const {
    isProcessing,
    processingError,
    rows,
    summaries: summaryAggregates,
  } = useReportDataPipeline({ fields, filters, rawRows, sorts })

  const computedFields = computed(() => {
    return fields.value.filter((field) => field.computed)
  })

  const fieldMappingMaps = computed(() => {
    return new Map(
      fields.value.map((field) => [field.key, buildFieldMappingMap(field)])
    )
  })

  const enabledFields = computed(() => {
    return fields.value.filter((field) => field.enabled)
  })

  const previewRows = computed(() => {
    return rows.value.slice(0, settings.previewLimit)
  })

  const designerStats = computed(() => {
    return [
      { label: '原始行', value: rawRows.value.length.toLocaleString('zh-CN') },
      { label: '有效行', value: rows.value.length.toLocaleString('zh-CN') },
      {
        label: '展示列',
        value: enabledFields.value.length.toLocaleString('zh-CN'),
      },
    ]
  })

  const exportWarning = computed(() => {
    if (rows.value.length >= settings.streamExportThreshold) {
      return `当前数据量达到百万级阈值（${settings.streamExportThreshold.toLocaleString('zh-CN')} 行），生产环境应走服务端流式导出和下载中心。`
    }

    if (rows.value.length >= settings.asyncExportThreshold) {
      return '当前数据量较大，建议优先导出 CSV，复杂 Excel 后续应切换 Web Worker 或服务端异步任务。'
    }

    if (rawRows.value.length !== rows.value.length) {
      return `已应用筛选：当前导出 ${rows.value.length.toLocaleString('zh-CN')} / ${rawRows.value.length.toLocaleString('zh-CN')} 行。`
    }

    if (enabledFields.value.length >= 30) {
      return '列数较多，建议控制样式复杂度，避免浏览器生成文件时出现明显卡顿。'
    }

    return ''
  })

  const summaryValues = computed(() => {
    if (!settings.showSummary) return []

    return enabledFields.value
      .filter((field) => field.summary !== 'none')
      .map((field) => {
        if (field.summary === 'count') {
          return {
            key: field.key,
            label: `${field.label} 数`,
            value: rows.value.length.toLocaleString('zh-CN'),
          }
        }

        const aggregate = summaryAggregates.value[field.key]
        const total = aggregate?.total ?? 0
        const value =
          field.summary === 'avg'
            ? total / Math.max(aggregate?.count ?? 0, 1)
            : total

        return {
          key: field.key,
          label: `${field.label}${field.summary === 'avg' ? '平均' : '合计'}`,
          value: formatCell(value, field),
        }
      })
  })

  const reportSchema = computed<ReportDesignerSchema>(() => {
    const activeSource = dataSources.value.find(
      (source) => source.id === activeSourceId.value
    )
    const sourceId = activeSource?.id ?? defaultSourceId

    return {
      $schema: 'https://wuhu.dev/schemas/report-designer/v1.json',
      schemaVersion: REPORT_SCHEMA_VERSION,
      activeSourceId: sourceId,
      dataSources: dataSources.value.map((source) => ({
        ...source,
        config: sanitizeDataSourceItem(source).config,
      })),
      datasets: [
        {
          fields: cloneFields(fields.value),
          id: 'dataset-main',
          name: activeSource?.name ?? settings.sheetName,
          primaryKey: fields.value[0]?.key ?? 'id',
          rowPath: sourceConfig.dataPath,
          sourceId,
        },
      ],
      description: settings.subtitle,
      export: {
        csv: {
          encoding: 'UTF-8 with BOM',
          separator: ',',
          streaming: rows.value.length >= settings.streamExportThreshold,
        },
        excel: {
          engine:
            rows.value.length >= settings.asyncExportThreshold
              ? 'serverXlsx'
              : 'clientHtmlXls',
          multiSheet: false,
          stylePreserved: true,
        },
        pdf: {
          engine:
            rows.value.length >= settings.asyncExportThreshold
              ? 'serverPdf'
              : 'browserPrint',
          fontEmbedding: false,
          pageBreaks: true,
        },
      },
      fields: cloneFields(fields.value),
      filters: cloneFilters(filters.value),
      parameters: inferParametersFromConfig(sourceConfig),
      performance: {
        asyncExportThreshold: settings.asyncExportThreshold,
        previewLimit: settings.previewLimit,
        streamExportThreshold: settings.streamExportThreshold,
        virtualPreview: rows.value.length > settings.previewLimit,
      },
      print: {
        margins: {
          bottom: settings.marginBottom,
          left: settings.marginLeft,
          right: settings.marginRight,
          top: settings.marginTop,
        },
        orientation: settings.orientation,
        pageFooter: settings.pageFooter,
        pageHeader: settings.pageHeader,
        paperSize: settings.paperSize,
        repeatTableHeader: settings.repeatTableHeader,
      },
      security: {
        auditEnabled: settings.permissionMode !== 'private',
        mode: settings.permissionMode,
        permissions: ['view', 'edit', 'export', 'print'],
        watermarkEnabled: !!settings.watermark,
      },
      settings: { ...settings },
      sorts: cloneSorts(sorts.value),
      templateType: settings.templateType,
      title: settings.title,
      version: '1.0.0',
    }
  })

  const schemaSource = computed(() =>
    JSON.stringify(reportSchema.value, null, 2)
  )

  function resolveMappedValue(value: unknown, field: ReportField) {
    if (!field.mappingEnabled) return value

    const mappingMap = fieldMappingMaps.value.get(field.key)
    const mappedValue = mappingMap?.get(normalizeMappingKey(value))
    return mappedValue === undefined ? value : mappedValue
  }

  function formatCell(value: unknown, field: ReportField, row?: ReportRow) {
    const mappedValue = resolveMappedValue(value, field)
    return formatFieldValue({ field, mappedValue, row, value })
  }

  function testFormatCell(value: unknown, field: ReportField, row?: ReportRow) {
    const mappedValue = resolveMappedValue(value, field)
    return testFieldFormatter({ field, mappedValue, row, value })
  }

  function updateSourceConfig(patch: Partial<DataSourceConfig>) {
    Object.assign(sourceConfig, patch)
  }

  function normalizeSourceConfigName(config: DataSourceConfig) {
    if (config.name.trim()) return config.name.trim()
    if (config.kind === 'rest') return 'REST API 数据源'
    if (config.kind === 'json') return 'JSON 数据源'
    if (config.kind === 'sql') return 'SQL 数据源'
    return defaultDataSourceConfig.name
  }

  function assignSourceConfig(config: DataSourceConfig) {
    Object.assign(sourceConfig, cloneSourceConfig(config))
  }

  function syncActiveDataSource() {
    const activeId = activeSourceId.value || defaultSourceId
    const nextConfig = cloneSourceConfig(sourceConfig)
    nextConfig.name = normalizeSourceConfigName(nextConfig)
    const nextSource: ReportDataSourceItem = {
      config: nextConfig,
      id: activeId,
      kind: nextConfig.kind,
      name: nextConfig.name,
      savedAt: new Date().toISOString(),
    }

    dataSources.value = normalizeDataSources([
      nextSource,
      ...dataSources.value.filter((source) => source.id !== activeId),
    ])
    persistDataSources(dataSources.value)
  }

  function selectDataSource(id: string) {
    const source = dataSources.value.find((item) => item.id === id)
    if (!source) return

    activeSourceId.value = source.id
    assignSourceConfig(source.config)
    loadError.value = ''
    exportStatus.value = `已选择数据源：${source.name}`
  }

  function saveDataSource(payload: { config: DataSourceConfig; id?: string }) {
    const sourceId =
      payload.id && payload.id !== defaultSourceId
        ? payload.id
        : createId('source')
    const config = cloneSourceConfig(payload.config)
    config.name = normalizeSourceConfigName(config)
    const nextSource: ReportDataSourceItem = {
      config,
      id: sourceId,
      kind: config.kind,
      name: config.name,
      savedAt: new Date().toISOString(),
    }

    dataSources.value = normalizeDataSources([
      nextSource,
      ...dataSources.value.filter((source) => source.id !== sourceId),
    ])
    persistDataSources(dataSources.value)
    activeSourceId.value = sourceId
    assignSourceConfig(config)
    loadError.value = ''
    exportStatus.value = `已保存数据源：${config.name}`
  }

  function deleteDataSource(id: string) {
    if (id === defaultSourceId) return

    const nextSources = normalizeDataSources(
      dataSources.value.filter((source) => source.id !== id)
    )
    dataSources.value = nextSources
    persistDataSources(nextSources)

    if (activeSourceId.value === id) {
      selectDataSource(nextSources[0]?.id ?? defaultSourceId)
    }
  }

  function updateSettings(patch: Partial<ReportSettings>) {
    Object.assign(settings, patch)
  }

  function replaceRows(nextRows: ReportRow[], nextFields?: ReportField[]) {
    const previousComputedFields = fields.value.filter(
      (field) => field.computed
    )
    rawRows.value = cloneRows(nextRows)
    fields.value = nextFields
      ? cloneFields(nextFields)
      : [
          ...inferFields(nextRows, fields.value),
          ...cloneFields(previousComputedFields),
        ]
  }

  function loadSampleData() {
    loadError.value = ''
    sourceConfig.kind = 'sample'
    sourceConfig.name = sourceConfig.name.trim() || defaultDataSourceConfig.name
    filters.value = []
    sorts.value = []
    replaceRows(sampleRows, defaultFields)
    syncActiveDataSource()
    exportStatus.value = '已恢复样例数据'
  }

  async function loadRemoteData() {
    if (!sourceConfig.endpoint.trim()) {
      loadError.value = '请先填写接口地址'
      return
    }

    isLoading.value = true
    loadError.value = ''

    try {
      const headers = parseKeyValueText(sourceConfig.headers)
      const body = buildRequestBody(sourceConfig.body)
      if (body && isJsonBody(sourceConfig.body) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
      }

      const response = await fetch(
        appendQueryParams(sourceConfig.endpoint, sourceConfig.queryParams),
        {
          body: sourceConfig.method === 'GET' ? undefined : body,
          headers,
          method: sourceConfig.method,
        }
      )

      if (!response.ok) {
        throw new Error(`接口返回 ${response.status}`)
      }

      const payload = await response.json()
      const nextRows = resolveRowsFromPayload(payload, sourceConfig.dataPath)

      if (!nextRows.length) {
        throw new Error('没有解析到数组数据')
      }

      replaceRows(nextRows)
      sourceConfig.kind = 'rest'
      sourceConfig.name = sourceConfig.name.trim() || 'REST API 数据源'
      syncActiveDataSource()
      exportStatus.value = `已加载接口数据：${nextRows.length.toLocaleString('zh-CN')} 行`
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : '接口加载失败'
    } finally {
      isLoading.value = false
    }
  }

  function loadJsonData() {
    loadError.value = ''

    try {
      const payload = JSON.parse(sourceConfig.rawJson)
      const nextRows = resolveRowsFromPayload(payload, sourceConfig.dataPath)

      if (!nextRows.length) {
        throw new Error('没有解析到数组数据')
      }

      sourceConfig.kind = 'json'
      sourceConfig.name = sourceConfig.name.trim() || 'JSON 数据源'
      replaceRows(nextRows)
      syncActiveDataSource()
      exportStatus.value = `已加载 JSON 数据：${nextRows.length.toLocaleString('zh-CN')} 行`
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : 'JSON 解析失败'
    }
  }

  function loadSqlData() {
    const requiredFields = [
      ['数据库地址', sourceConfig.sqlHost],
      ['端口', sourceConfig.sqlPort],
      ['数据库名', sourceConfig.sqlDatabase],
      ['用户名', sourceConfig.sqlUsername],
      ['密码', sourceConfig.sqlPassword],
      ['SQL 语句', sourceConfig.sqlText],
    ].filter(([, value]) => !String(value).trim())

    if (requiredFields.length) {
      loadError.value = `请完善 SQL 数据源：${requiredFields.map(([label]) => label).join('、')}`
      return
    }

    loadError.value = ''
    sourceConfig.kind = 'sql'
    if (
      !sourceConfig.name.trim() ||
      sourceConfig.name.trim() === defaultDataSourceConfig.name
    ) {
      sourceConfig.name = `${sourceConfig.sqlDatabase} SQL 数据源`
    }
    syncActiveDataSource()
    exportStatus.value = '已保存 SQL 数据源配置，等待服务端执行查询'
  }

  function loadActiveSourceData() {
    if (sourceConfig.kind === 'sample') {
      loadSampleData()
      return
    }

    if (sourceConfig.kind === 'rest') {
      void loadRemoteData()
      return
    }

    if (sourceConfig.kind === 'json') {
      loadJsonData()
      return
    }

    loadSqlData()
  }

  function toggleField(key: string) {
    fields.value = fields.value.map((field) => {
      return field.key === key ? { ...field, enabled: !field.enabled } : field
    })
  }

  function updateField(key: string, patch: Partial<ReportField>) {
    fields.value = fields.value.map((field) => {
      return field.key === key ? { ...field, ...patch } : field
    })
  }

  function renameFieldKey(currentKey: string, nextKeyValue: string) {
    const nextKey = nextKeyValue.trim()
    const targetField = fields.value.find((field) => field.key === currentKey)
    if (!targetField) return

    if (!nextKey) {
      templateStatus.value = '字段名不能为空'
      return
    }

    if (nextKey === currentKey) return

    if (fields.value.some((field) => field.key === nextKey)) {
      templateStatus.value = '字段名已存在'
      return
    }

    const blocksComputedExpression = fields.value.some((field) => {
      return (
        field.computed &&
        expressionHasIdentifier(field.expression ?? '', currentKey)
      )
    })

    if (blocksComputedExpression && !isExpressionIdentifier(nextKey)) {
      templateStatus.value = '字段被计算字段引用，请使用字母、数字、_ 或 $'
      return
    }

    fields.value = fields.value.map((field) => {
      const renamedField =
        field.key === currentKey ? { ...field, key: nextKey } : field

      if (!renamedField.computed || !renamedField.expression) {
        return renamedField
      }

      return {
        ...renamedField,
        expression: renameExpressionIdentifier(
          renamedField.expression,
          currentKey,
          nextKey
        ),
      }
    })
    filters.value = filters.value.map((filter) => {
      return filter.fieldKey === currentKey
        ? { ...filter, fieldKey: nextKey }
        : filter
    })
    sorts.value = sorts.value.map((sort) => {
      return sort.fieldKey === currentKey
        ? { ...sort, fieldKey: nextKey }
        : sort
    })

    if (!targetField.computed) {
      rawRows.value = rawRows.value.map((row) =>
        renameRawRowKey(row, currentKey, nextKey)
      )
    }

    templateStatus.value = `已重命名字段：${currentKey} 为 ${nextKey}`
  }

  function createCustomFieldKey() {
    let index = fields.value.length + 1
    let key = `customField${index}`

    while (fields.value.some((field) => field.key === key)) {
      index += 1
      key = `customField${index}`
    }

    return { index, key }
  }

  function addField() {
    const { index, key } = createCustomFieldKey()

    rawRows.value = rawRows.value.map((row) => ({
      ...row,
      [key]: '',
    }))
    fields.value = [
      ...fields.value,
      {
        align: 'left',
        enabled: true,
        key,
        label: `自定义字段 ${index}`,
        summary: 'none',
        type: 'string',
        width: 140,
      },
    ]
    templateStatus.value = `已添加字段：${key}`
  }

  function removeField(key: string) {
    const targetField = fields.value.find((field) => field.key === key)
    if (!targetField) return

    if (fields.value.length <= 1) {
      templateStatus.value = '至少保留一个字段'
      return
    }

    fields.value = fields.value.filter((field) => field.key !== key)
    filters.value = filters.value.filter((filter) => filter.fieldKey !== key)
    sorts.value = sorts.value.filter((sort) => sort.fieldKey !== key)

    if (!targetField.computed) {
      rawRows.value = rawRows.value.map((row) => {
        const nextRow = { ...row }
        delete nextRow[key]
        return nextRow
      })
    }

    templateStatus.value = `已删除字段：${key}`
  }

  function moveField(key: string, direction: 'up' | 'down') {
    const nextFields = cloneFields(fields.value)
    const currentIndex = nextFields.findIndex((field) => field.key === key)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= nextFields.length)
      return

    const [field] = nextFields.splice(currentIndex, 1)
    nextFields.splice(targetIndex, 0, field)
    fields.value = nextFields
  }

  function reorderFields(nextFieldKeys: string[]) {
    const fieldMap = new Map(fields.value.map((field) => [field.key, field]))
    const orderedKeys = Array.from(
      new Set(nextFieldKeys.filter((fieldKey) => fieldMap.has(fieldKey)))
    )
    const orderedFields = orderedKeys
      .map((fieldKey) => fieldMap.get(fieldKey))
      .filter((field): field is ReportField => !!field)
    const orderedKeySet = new Set(orderedKeys)
    const remainingFields = fields.value.filter(
      (field) => !orderedKeySet.has(field.key)
    )

    fields.value = cloneFields([...orderedFields, ...remainingFields])
  }

  function addComputedField(payload: {
    expression: string
    key: string
    label: string
    type: FieldType
  }) {
    const key = sanitizeFieldKey(payload.key)
    if (!key || !payload.expression.trim()) {
      templateStatus.value = '请填写计算字段编码和表达式'
      return
    }

    if (fields.value.some((field) => field.key === key)) {
      templateStatus.value = '字段编码已存在'
      return
    }

    const isNumberLike = ['number', 'currency', 'percent'].includes(
      payload.type
    )
    fields.value = [
      ...fields.value,
      {
        align: isNumberLike ? 'right' : 'left',
        computed: true,
        enabled: true,
        expression: payload.expression.trim(),
        key,
        label: payload.label.trim() || toTitle(key),
        summary: isNumberLike ? 'sum' : 'none',
        type: payload.type,
        width: 120,
      },
    ]
    templateStatus.value = `已添加计算字段：${key}`
  }

  function removeComputedField(key: string) {
    fields.value = fields.value.filter(
      (field) => field.key !== key || !field.computed
    )
    filters.value = filters.value.filter((filter) => filter.fieldKey !== key)
    sorts.value = sorts.value.filter((sort) => sort.fieldKey !== key)
    templateStatus.value = `已移除计算字段：${key}`
  }

  function firstFieldKey() {
    return fields.value[0]?.key ?? ''
  }

  function addFilter() {
    filters.value = [
      ...filters.value,
      {
        enabled: true,
        fieldKey: firstFieldKey(),
        id: createId('filter'),
        operator: 'contains',
        secondValue: '',
        value: '',
      },
    ]
  }

  function updateFilter(id: string, patch: Partial<ReportFilter>) {
    filters.value = filters.value.map((filter) => {
      return filter.id === id ? { ...filter, ...patch } : filter
    })
  }

  function removeFilter(id: string) {
    filters.value = filters.value.filter((filter) => filter.id !== id)
  }

  function addSort() {
    sorts.value = [
      ...sorts.value,
      {
        direction: 'asc',
        enabled: true,
        fieldKey: firstFieldKey(),
        id: createId('sort'),
      },
    ]
  }

  function updateSort(id: string, patch: Partial<ReportSort>) {
    sorts.value = sorts.value.map((sort) => {
      return sort.id === id ? { ...sort, ...patch } : sort
    })
  }

  function removeSort(id: string) {
    sorts.value = sorts.value.filter((sort) => sort.id !== id)
  }

  function buildExportRows() {
    return buildTableRows(
      rows.value,
      enabledFields.value,
      settings.showIndex,
      formatCell
    )
  }

  function buildExportHeaders() {
    const headers = enabledFields.value.map((field) => field.label)
    return settings.showIndex ? ['序号', ...headers] : headers
  }

  function exportCsv() {
    const headers = buildExportHeaders()
    const tableRows = buildExportRows()
    const content = [headers, ...tableRows]
      .map((line) => line.map(escapeCsv).join(','))
      .join('\r\n')

    downloadBlob(
      new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8' }),
      `${sanitizeFileName(settings.fileName)}.csv`
    )
  }

  function exportJson() {
    const payload = {
      template: {
        fields: enabledFields.value,
        filters: filters.value,
        settings: { ...settings },
        sheetName: settings.sheetName,
        sorts: sorts.value,
        sourceConfig: sanitizeDataSourceConfig(cloneSourceConfig(sourceConfig)),
        subtitle: settings.subtitle,
        title: settings.title,
      },
      rows: rows.value.map((row) => {
        return Object.fromEntries(
          enabledFields.value.map((field) => [
            field.key,
            formatCell(row[field.key], field, row),
          ])
        )
      }),
    }

    downloadBlob(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json;charset=utf-8',
      }),
      `${sanitizeFileName(settings.fileName)}.json`
    )
  }

  function exportSchema() {
    downloadBlob(
      new Blob([schemaSource.value], {
        type: 'application/schema+json;charset=utf-8',
      }),
      `${sanitizeFileName(settings.fileName)}.schema.json`
    )
    exportStatus.value = '已导出报表 Schema'
  }

  function createHtmlTable(options: { inlineBorders?: boolean } = {}) {
    const headers = buildExportHeaders()
    const tableRows = buildExportRows()
    const tableAttributes = options.inlineBorders
      ? 'border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #d1d5db;mso-border-alt:solid #d1d5db .5pt;"'
      : ''
    const cellStyle = options.inlineBorders
      ? ' style="border:1px solid #d1d5db;mso-border-alt:solid #d1d5db .5pt;"'
      : ''
    const headCells = headers
      .map((header) => `<th${cellStyle}>${escapeHtml(header)}</th>`)
      .join('')
    const bodyRows = tableRows
      .map((row) => {
        return `<tr>${row.map((cell) => `<td${cellStyle}>${escapeHtml(cell)}</td>`).join('')}</tr>`
      })
      .join('')

    return `
      <h1>${escapeHtml(settings.title)}</h1>
      <p>${escapeHtml(settings.subtitle)}</p>
      <table ${tableAttributes}>
        <thead><tr>${headCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      ${
        settings.showFooter
          ? `<footer>${escapeHtml(settings.watermark)} · ${escapeHtml(settings.pageFooter)} · ${new Date().toLocaleString('zh-CN')}</footer>`
          : ''
      }
    `
  }

  function exportXls() {
    const theme = exportThemeTokens[settings.theme]
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: "Microsoft YaHei", sans-serif; color: #111827; }
            h1 { font-size: 20px; margin: 0 0 6px; }
            p { margin: 0 0 14px; color: #64748b; }
            table { border-collapse: collapse; width: 100%; border: 1px solid #d1d5db; mso-border-alt: solid #d1d5db .5pt; }
            th { background: ${theme.headerBackground}; color: ${theme.headerColor}; font-weight: 700; }
            th, td { border: 1px solid #d1d5db; padding: 8px 10px; mso-border-alt: solid #d1d5db .5pt; mso-number-format: "\\@"; }
            tbody tr:last-child td { border-bottom: 1px solid #d1d5db; }
            footer { margin-top: 16px; color: #64748b; }
          </style>
        </head>
        <body>${createHtmlTable({ inlineBorders: true })}</body>
      </html>
    `

    downloadBlob(
      new Blob([`\uFEFF${html}`], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      }),
      `${sanitizeFileName(settings.fileName)}.xls`
    )
  }

  function printReport() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      exportStatus.value = '浏览器拦截了打印窗口'
      return
    }

    const theme = exportThemeTokens[settings.theme]
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(settings.title)}</title>
          <style>
            @page {
              size: ${getPrintPageSize(settings)};
              margin: ${getPrintMargins(settings)};
            }
            body { font-family: "Microsoft YaHei", sans-serif; color: #111827; }
            h1 { font-size: 22px; margin: 0 0 6px; }
            p { margin: 0 0 16px; color: #64748b; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            thead { display: ${settings.repeatTableHeader ? 'table-header-group' : 'table-row-group'}; }
            th { background: ${theme.headerBackground}; color: ${theme.headerColor}; font-weight: 700; }
            th, td { border: 1px solid #d1d5db; padding: 7px 8px; }
            .print-header { margin-bottom: 10px; color: #64748b; font-size: 12px; }
            footer { margin-top: 16px; color: #64748b; }
          </style>
        </head>
        <body>
          ${settings.pageHeader ? `<div class="print-header">${escapeHtml(settings.pageHeader)}</div>` : ''}
          ${createHtmlTable()}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  function exportReport(format: ExportFormat) {
    if (isProcessing.value) {
      exportStatus.value = '数据正在计算，请稍后导出'
      return
    }

    if (!enabledFields.value.length) {
      exportStatus.value = '请至少选择一个字段'
      return
    }

    if (!rows.value.length) {
      exportStatus.value = '当前没有可导出的数据'
      return
    }

    if (rows.value.length >= settings.asyncExportThreshold) {
      exportStatus.value = `数据量已达到 ${settings.asyncExportThreshold.toLocaleString('zh-CN')} 行，请使用服务端异步导出`
      return
    }

    if (format === 'csv') exportCsv()
    if (format === 'xls') exportXls()
    if (format === 'json') exportJson()
    if (format === 'pdf') printReport()
    if (format === 'print') printReport()

    exportStatus.value =
      format === 'pdf' || format === 'print'
        ? '已打开打印预览，可打印或另存为 PDF'
        : `已生成 ${format.toUpperCase()} 导出`
  }

  function importReportSchema(value: string) {
    const payload = parseReportSchema(value)

    const nextSettings = {
      ...defaultReportSettings,
      ...payload.settings,
      subtitle:
        payload.description ?? payload.settings?.subtitle ?? settings.subtitle,
      templateType:
        payload.templateType ??
        payload.settings?.templateType ??
        settings.templateType,
      title: payload.title ?? payload.settings?.title ?? settings.title,
    }

    Object.assign(settings, nextSettings)
    fields.value = cloneFields(payload.fields)
    filters.value = cloneFilters(payload.filters ?? [])
    sorts.value = cloneSorts(payload.sorts ?? [])

    if (Array.isArray(payload.dataSources) && payload.dataSources.length) {
      const nextSources = normalizeDataSources(payload.dataSources)
      dataSources.value = nextSources
      persistDataSources(nextSources)

      const sourceId = nextSources.some(
        (source) => source.id === payload.activeSourceId
      )
        ? payload.activeSourceId
        : nextSources[0]?.id
      if (sourceId) {
        activeSourceId.value = sourceId
        const activeSource = nextSources.find(
          (source) => source.id === sourceId
        )
        if (activeSource) assignSourceConfig(activeSource.config)
      }
    }

    templateStatus.value = `已导入 Schema：${settings.title}`
    exportStatus.value = 'Schema 已同步到设计器'
  }

  function saveTemplate(name: string) {
    const cleanName = name.trim() || settings.title.trim() || '未命名模板'
    const existingTemplate = templates.value.find(
      (template) => template.name === cleanName
    )
    const snapshot: ReportTemplateSnapshot = {
      fields: cloneFields(fields.value),
      filters: cloneFilters(filters.value),
      id: existingTemplate?.id ?? createId('template'),
      name: cleanName,
      savedAt: new Date().toISOString(),
      settings: { ...settings },
      sorts: cloneSorts(sorts.value),
      sourceConfig: cloneSourceConfig(sourceConfig),
    }
    const nextTemplates = [
      snapshot,
      ...templates.value.filter((template) => template.id !== snapshot.id),
    ].slice(0, maxTemplateCount)

    templates.value = nextTemplates
    persistTemplates(nextTemplates)
    templateStatus.value = `已保存模板：${cleanName}`
  }

  function loadTemplate(id: string) {
    const snapshot = templates.value.find((template) => template.id === id)
    if (!snapshot) {
      templateStatus.value = '请选择要加载的模板'
      return
    }

    Object.assign(sourceConfig, cloneSourceConfig(snapshot.sourceConfig))
    Object.assign(settings, { ...defaultReportSettings, ...snapshot.settings })
    fields.value = cloneFields(snapshot.fields)
    filters.value = cloneFilters(snapshot.filters)
    sorts.value = cloneSorts(snapshot.sorts)
    templateStatus.value = `已加载模板：${snapshot.name}`
  }

  function deleteTemplate(id: string) {
    const snapshot = templates.value.find((template) => template.id === id)
    templates.value = templates.value.filter((template) => template.id !== id)
    persistTemplates(templates.value)
    templateStatus.value = snapshot
      ? `已删除模板：${snapshot.name}`
      : '模板已删除'
  }

  return {
    activeSourceId,
    computedFields,
    dataSources,
    designerStats,
    enabledFields,
    exportStatus,
    exportWarning,
    fields,
    filters,
    isLoading,
    isProcessing,
    loadError,
    processingError,
    previewRows,
    reportSchema,
    rows,
    schemaSource,
    settings,
    sorts,
    sourceConfig,
    summaryValues,
    templateStatus,
    templates,
    addComputedField,
    addFilter,
    addSort,
    deleteTemplate,
    exportSchema,
    exportReport,
    formatCell,
    addField,
    testFormatCell,
    loadJsonData,
    loadActiveSourceData,
    importReportSchema,
    loadRemoteData,
    loadSampleData,
    loadSqlData,
    loadTemplate,
    moveField,
    removeField,
    renameFieldKey,
    reorderFields,
    removeComputedField,
    removeFilter,
    removeSort,
    saveTemplate,
    saveDataSource,
    selectDataSource,
    toggleField,
    deleteDataSource,
    updateField,
    updateFilter,
    updateSettings,
    updateSort,
    updateSourceConfig,
  }
}
