import type { IWorkbookData } from '@univerjs/core'

/**
 * 单元格错误值
 */
export type CellError =
  | '#REF!'
  | '#VALUE!'
  | '#DIV/0!'
  | '#NAME?'
  | '#CIRC!'
  | '#N/A'

/**
 * 报表标量值
 */
export type Scalar = string | number | boolean | null

export interface ComputeError {
  /**
   * @desc 错误码
   */
  __error: CellError
}

export type ComputedValue = Scalar | ComputeError

export type NumberFormat =
  | 'general'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'

export type HorizontalAlign = 'left' | 'center' | 'right'
export type VerticalAlign = 'top' | 'middle' | 'bottom'

export interface CellBorder {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

/**
 * 报表导出/旧版迁移使用的样式描述
 */
export interface CellStyle {
  fontFamily?: string
  fontSize?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
  color?: string
  fill?: string
  align?: HorizontalAlign
  valign?: VerticalAlign
  border?: CellBorder
  numFmt?: NumberFormat
}

export interface Band {
  startRow: number
  endRow: number
}

export type RegionFilterOperator =
  | 'eq'
  | 'neq'
  | 'contains'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'

export interface RegionFilter {
  id: string
  field: string
  operator: RegionFilterOperator
  value: string
}

export interface SortSpec {
  field: string
  desc: boolean
}

export interface GroupSpec {
  field: string
  /**
   * @desc 分组头 Band,可选
   */
  header?: Band
  /**
   * @desc 分组尾 Band,可选
   */
  footer?: Band
}

export interface DataRegion {
  id: string
  datasetId: string
  /**
   * @desc 明细行 Band,预览时按数据行重复
   */
  detail: Band
  /**
   * @desc 分组配置,按顺序嵌套
   */
  groups: GroupSpec[]
  filters: RegionFilter[]
  sort: SortSpec[]
}

export interface ReportSheetMeta {
  regions: DataRegion[]
}

export interface ReportMeta {
  datasets: Dataset[]
  parameters: ReportParameter[]
  print: PrintSettings
  /**
   * @desc 当前活动工作表 id
   */
  activeSheetId: string
  /**
   * @desc 按工作表 id 保存的报表配置
   */
  sheets: Record<string, ReportSheetMeta>
}

/**
 * 报表设计器持久化文档
 */
export interface ReportDocument {
  schemaVersion: number
  workbook: IWorkbookData
  report: ReportMeta
}

export type DatasetFieldType = 'string' | 'number' | 'boolean' | 'date'

export interface DatasetField {
  key: string
  label: string
  type: DatasetFieldType
}

export type DatasetSource =
  | {
      kind: 'sample' | 'json'
      json: string
    }
  | {
      kind: 'rest'
      url: string
      dataPath?: string
      headers?: Record<string, string>
    }

export interface Dataset {
  id: string
  name: string
  source: DatasetSource
  fields: DatasetField[]
  rows: Record<string, Scalar>[]
  /**
   * @desc 最近一次加载错误
   */
  error?: string
}

export type ReportParameterType = 'text' | 'number' | 'date'

export interface ReportParameter {
  key: string
  label: string
  type: ReportParameterType
  defaultValue: string
}

export interface PrintSettings {
  paper: 'A4' | 'A3' | 'Letter'
  orientation: 'portrait' | 'landscape'
  margins: [number, number, number, number]
}

export interface CellRange {
  startRow: number
  startCol: number
  endRow: number
  endCol: number
}

export interface SheetInfo {
  id: string
  name: string
  rowCount: number
  columnCount: number
  freezeRows: number
  freezeCols: number
  mergeCount: number
  regionCount: number
}

export interface PreviewResult {
  workbook: IWorkbookData
  activeSheetId: string
  rowCount: number
  truncated: boolean
  errors: string[]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export const MAX_ROWS = 20000
export const MAX_COLS = 200
export const MAX_SHEETS = 8
export const SCHEMA_VERSION = 3
export const DEFAULT_ROW_HEIGHT = 24
export const DEFAULT_COL_WIDTH = 96

export function isComputeError(value: ComputedValue): value is ComputeError {
  return typeof value === 'object' && value !== null && '__error' in value
}
