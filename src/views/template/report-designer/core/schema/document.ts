import {
  LocaleType,
  getSheetsEmptySnapshot,
  type ICellData,
  type IStyleData,
  type IWorkbookData,
  type IWorksheetData,
} from '@univerjs/core'
import {
  SCHEMA_VERSION,
  type CellStyle,
  type DataRegion,
  type Dataset,
  type PrintSettings,
  type ReportDocument,
  type ReportMeta,
  type ReportParameter,
  type ReportSheetMeta,
  type Scalar,
} from '../../types'
import { legacyStyleToUniver } from '../adapters/snapshot'

interface LegacyCell {
  v?: Scalar
  f?: string
  s?: string
}

interface LegacyMerge {
  id: string
  top: number
  left: number
  rowSpan: number
  colSpan: number
}

interface LegacySheet {
  id: string
  name: string
  rowCount: number
  colCount: number
  cells: Record<string, LegacyCell>
  colWidths: Record<number, number>
  rowHeights: Record<number, number>
  merges: LegacyMerge[]
  freeze: { rows: number; cols: number }
  regions: DataRegion[]
}

interface LegacyWorkbook {
  schemaVersion?: number
  id: string
  name: string
  sheets: LegacySheet[]
  activeSheetId?: string
  styles?: Record<string, CellStyle>
  datasets?: Dataset[]
  parameters?: ReportParameter[]
  print?: PrintSettings
}

/**
 * 序列化报表文档
 * @param document 文档
 * @returns JSON 文本
 */
export function serializeDocument(document: ReportDocument) {
  return JSON.stringify(document, null, 2)
}

/**
 * 反序列化报表文档
 * @param json JSON 文本
 * @returns 文档,非法时返回 undefined
 */
export function deserializeDocument(json: string): ReportDocument | undefined {
  try {
    return migrateDocument(JSON.parse(json))
  } catch {
    return undefined
  }
}

/**
 * 迁移任意版本的报表数据
 * @param input 未知数据
 * @returns 文档
 */
export function migrateDocument(input: unknown): ReportDocument | undefined {
  if (!isRecord(input)) return undefined
  if (isRecord(input.workbook) && isRecord(input.report)) {
    return normalizeDocument(
      input as unknown as { workbook: unknown; report: unknown }
    )
  }
  if (Array.isArray(input.sheets)) {
    return migrateLegacyWorkbook(input as unknown as LegacyWorkbook)
  }
  return undefined
}

/**
 * 导出用文档(移除 REST 数据集行)
 * @param document 文档
 * @returns 可导出的副本
 */
export function createExportDocument(document: ReportDocument): ReportDocument {
  const copy = structuredClone(document)
  copy.report.datasets = copy.report.datasets.map((dataset) =>
    dataset.source.kind === 'rest'
      ? { ...dataset, rows: [], error: undefined }
      : dataset
  )
  return copy
}

function normalizeDocument(input: {
  workbook: unknown
  report: unknown
}): ReportDocument | undefined {
  const schemaVersion = Number(
    (input as { schemaVersion?: unknown }).schemaVersion ?? SCHEMA_VERSION
  )
  if (schemaVersion > SCHEMA_VERSION) return undefined
  const workbook = normalizeWorkbook(input.workbook)
  if (!workbook) return undefined
  const report = normalizeReportMeta(input.report, workbook)
  return { schemaVersion: SCHEMA_VERSION, workbook, report }
}

function normalizeWorkbook(value: unknown): IWorkbookData | undefined {
  if (!isRecord(value)) return undefined
  if (!Array.isArray(value.sheetOrder) || value.sheetOrder.length === 0) {
    return undefined
  }
  if (!isRecord(value.sheets)) return undefined
  if (typeof value.id !== 'string') return undefined
  return value as unknown as IWorkbookData
}

function normalizeReportMeta(
  value: unknown,
  workbook: IWorkbookData
): ReportMeta {
  const record = isRecord(value) ? value : {}
  const sheets: Record<string, ReportSheetMeta> = {}
  if (isRecord(record.sheets)) {
    Object.entries(record.sheets).forEach(([sheetId, meta]) => {
      if (!isRecord(meta)) return
      sheets[sheetId] = {
        regions: Array.isArray(meta.regions)
          ? (meta.regions as DataRegion[])
          : [],
      }
    })
  }
  workbook.sheetOrder.forEach((sheetId) => {
    sheets[sheetId] ??= { regions: [] }
  })
  Object.keys(sheets).forEach((sheetId) => {
    if (!workbook.sheetOrder.includes(sheetId)) delete sheets[sheetId]
  })

  const activeSheetId =
    typeof record.activeSheetId === 'string' &&
    workbook.sheetOrder.includes(record.activeSheetId)
      ? record.activeSheetId
      : workbook.sheetOrder[0]

  return {
    datasets: Array.isArray(record.datasets)
      ? (record.datasets as Dataset[])
      : [],
    parameters: Array.isArray(record.parameters)
      ? (record.parameters as ReportParameter[])
      : [],
    print: isPrintSettings(record.print)
      ? record.print
      : { paper: 'A4', orientation: 'portrait', margins: [12, 12, 12, 12] },
    activeSheetId,
    sheets,
  }
}

function migrateLegacyWorkbook(
  legacy: LegacyWorkbook
): ReportDocument | undefined {
  if (!Array.isArray(legacy.sheets) || legacy.sheets.length === 0) {
    return undefined
  }
  const workbook = getSheetsEmptySnapshot(
    typeof legacy.id === 'string' ? legacy.id : `workbook-${Date.now()}`,
    LocaleType.ZH_CN,
    typeof legacy.name === 'string' ? legacy.name : '未命名报表'
  )
  const styles: Record<string, IStyleData> = {}
  Object.entries(legacy.styles ?? {}).forEach(([id, style]) => {
    styles[id] = legacyStyleToUniver(style)
  })
  workbook.styles = styles

  const sheets: Record<string, IWorksheetData> = {}
  const sheetOrder: string[] = []
  const regionMeta: Record<string, ReportSheetMeta> = {}

  legacy.sheets.forEach((sheet) => {
    const sheetData = createLegacySheet(sheet)
    sheets[sheet.id] = sheetData
    sheetOrder.push(sheet.id)
    regionMeta[sheet.id] = {
      regions: Array.isArray(sheet.regions) ? sheet.regions : [],
    }
  })

  workbook.sheetOrder = sheetOrder
  workbook.sheets = sheets

  const activeSheetId =
    typeof legacy.activeSheetId === 'string' &&
    sheetOrder.includes(legacy.activeSheetId)
      ? legacy.activeSheetId
      : sheetOrder[0]

  return {
    schemaVersion: SCHEMA_VERSION,
    workbook,
    report: {
      datasets: Array.isArray(legacy.datasets) ? legacy.datasets : [],
      parameters: Array.isArray(legacy.parameters) ? legacy.parameters : [],
      print: isPrintSettings(legacy.print)
        ? legacy.print
        : { paper: 'A4', orientation: 'portrait', margins: [12, 12, 12, 12] },
      activeSheetId,
      sheets: regionMeta,
    },
  }
}

function createLegacySheet(sheet: LegacySheet): IWorksheetData {
  const randomId = globalThis.crypto?.randomUUID?.() ?? String(Date.now())
  const workbook = getSheetsEmptySnapshot(
    `legacy-${randomId}`,
    LocaleType.ZH_CN,
    sheet.name
  )
  const template = Object.values(workbook.sheets)[0] as IWorksheetData

  const cellData: Record<number, Record<number, ICellData>> = {}
  Object.entries(sheet.cells ?? {}).forEach(([key, cell]) => {
    const [row, col] = key.split(':').map(Number)
    if (!Number.isFinite(row) || !Number.isFinite(col)) return
    const next: ICellData = {}
    if (cell.v !== undefined) next.v = cell.v
    if (cell.f) next.f = cell.f
    if (cell.s) next.s = cell.s
    if (!next.v && !next.f && !next.s) return
    cellData[row] ??= {}
    cellData[row][col] = next
  })

  return {
    ...template,
    id: sheet.id,
    name: sheet.name,
    rowCount: Math.max(1, Number(sheet.rowCount) || 1000),
    columnCount: Math.max(1, Number(sheet.colCount) || 26),
    freeze: {
      startRow: Math.max(0, Number(sheet.freeze?.rows) || 0),
      startColumn: Math.max(0, Number(sheet.freeze?.cols) || 0),
      xSplit: Math.max(0, Number(sheet.freeze?.cols) || 0),
      ySplit: Math.max(0, Number(sheet.freeze?.rows) || 0),
    },
    mergeData: (sheet.merges ?? []).map((merge) => ({
      startRow: merge.top,
      startColumn: merge.left,
      endRow: merge.top + merge.rowSpan - 1,
      endColumn: merge.left + merge.colSpan - 1,
    })),
    cellData,
    rowData: Object.fromEntries(
      Object.entries(sheet.rowHeights ?? {}).map(([row, height]) => [
        Number(row),
        { h: Number(height) },
      ])
    ),
    columnData: Object.fromEntries(
      Object.entries(sheet.colWidths ?? {}).map(([col, width]) => [
        Number(col),
        { w: Number(width) },
      ])
    ),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isPrintSettings(value: unknown): value is PrintSettings {
  return (
    isRecord(value) &&
    typeof value.paper === 'string' &&
    typeof value.orientation === 'string' &&
    Array.isArray(value.margins)
  )
}
