import {
  BooleanNumber,
  BorderStyleTypes,
  HorizontalAlign,
  VerticalAlign,
  type ICellData,
  type IStyleData,
  type IWorkbookData,
  type IWorksheetData,
} from '@univerjs/core'
import type {
  CellBorder,
  CellStyle,
  HorizontalAlign as LegacyHorizontalAlign,
  NumberFormat,
  VerticalAlign as LegacyVerticalAlign,
} from '../../types'

const NUMBER_PATTERNS: Record<NumberFormat, string> = {
  general: '',
  number: '#,##0.00',
  currency: '¥#,##0.00',
  percent: '0.00%',
  date: 'yyyy-mm-dd',
  datetime: 'yyyy-mm-dd hh:mm:ss',
}

/**
 * 旧样式转换为 Univer 样式
 * @param style 旧样式
 * @returns Univer 样式数据
 */
export function legacyStyleToUniver(style: CellStyle): IStyleData {
  const result: IStyleData = {}
  if (style.fontFamily) result.ff = style.fontFamily
  if (style.fontSize) result.fs = Math.max(1, Math.round(style.fontSize * 0.75))
  if (style.bold) result.bl = BooleanNumber.TRUE
  if (style.italic) result.it = BooleanNumber.TRUE
  if (style.underline) result.ul = { s: BooleanNumber.TRUE }
  if (style.color) result.cl = { rgb: style.color }
  if (style.fill) result.bg = { rgb: style.fill }
  if (style.align) result.ht = toUniverHorizontalAlign(style.align)
  if (style.valign) result.vt = toUniverVerticalAlign(style.valign)
  if (style.border) result.bd = toUniverBorder(style.border)
  if (style.numFmt && style.numFmt !== 'general') {
    result.n = { pattern: NUMBER_PATTERNS[style.numFmt] }
  }
  return result
}

/**
 * Univer 样式转换为旧样式(导出/旧版迁移兼容)
 * @param style Univer 样式
 * @returns 旧样式
 */
export function univerStyleToLegacy(
  style: IStyleData | null | undefined
): CellStyle {
  if (!style) return {}
  const result: CellStyle = {}
  if (style.ff) result.fontFamily = style.ff
  if (style.fs) result.fontSize = Math.max(1, Math.round(style.fs / 0.75))
  if (style.bl === BooleanNumber.TRUE) result.bold = true
  if (style.it === BooleanNumber.TRUE) result.italic = true
  if (style.ul?.s === BooleanNumber.TRUE) result.underline = true
  if (style.cl?.rgb) result.color = style.cl.rgb
  if (style.bg?.rgb) result.fill = style.bg.rgb
  const align = fromUniverHorizontalAlign(style.ht)
  if (align) result.align = align
  const valign = fromUniverVerticalAlign(style.vt)
  if (valign) result.valign = valign
  const border = fromUniverBorder(style.bd)
  if (border) result.border = border
  const numFmt = fromPattern(style.n?.pattern)
  if (numFmt) result.numFmt = numFmt
  return result
}

/**
 * 解析单元格样式(支持样式 id 与内联样式)
 * @param workbook 工作簿快照
 * @param cell 单元格
 * @returns Univer 样式
 */
export function resolveCellStyle(
  workbook: IWorkbookData,
  cell: ICellData | undefined
): IStyleData {
  if (!cell?.s) return {}
  if (typeof cell.s === 'string') return workbook.styles[cell.s] ?? {}
  return cell.s ?? {}
}

/**
 * 读取单元格
 * @param sheet 工作表快照
 * @param row 行下标
 * @param col 列下标
 * @returns 单元格数据
 */
export function getSnapshotCell(
  sheet: Partial<IWorksheetData>,
  row: number,
  col: number
): ICellData | undefined {
  return sheet.cellData?.[row]?.[col] ?? undefined
}

/**
 * 写入单元格
 * @param sheet 工作表快照
 * @param row 行下标
 * @param col 列下标
 * @param cell 单元格数据
 */
export function setSnapshotCell(
  sheet: Partial<IWorksheetData>,
  row: number,
  col: number,
  cell: ICellData | undefined
) {
  if (!cell || isCellEmpty(cell)) {
    const rowData = sheet.cellData?.[row]
    if (rowData) {
      delete rowData[col]
      if (!Object.keys(rowData).length && sheet.cellData) {
        delete sheet.cellData[row]
      }
    }
    return
  }
  sheet.cellData ??= {}
  sheet.cellData[row] ??= {}
  sheet.cellData[row][col] = cell
}

/**
 * 判断单元格是否为空
 * @param cell 单元格
 * @returns 是否为空
 */
export function isCellEmpty(cell: ICellData | undefined | null) {
  if (!cell) return true
  return (
    cell.v === undefined &&
    cell.f === undefined &&
    cell.p === undefined &&
    cell.s === undefined &&
    cell.t === undefined
  )
}

/**
 * 克隆工作簿快照
 * @param workbook 工作簿
 * @returns 副本
 */
export function cloneWorkbookData(workbook: IWorkbookData): IWorkbookData {
  return structuredClone(workbook)
}

/**
 * 裁剪空单元格与空行,降低持久化体积
 * @param workbook 工作簿
 * @returns 新快照
 */
export function pruneWorkbookData(workbook: IWorkbookData): IWorkbookData {
  const next = cloneWorkbookData(workbook)
  Object.values(next.sheets).forEach((sheet) => {
    Object.entries(sheet.cellData ?? {}).forEach(([rowKey, row]) => {
      const entries = Object.entries(row) as Array<
        [string, ICellData | null | undefined]
      >
      entries.forEach(([colKey, cell]) => {
        if (isCellEmpty(cell)) delete row[Number(colKey)]
      })
      if (!Object.keys(row).length && sheet.cellData) {
        delete sheet.cellData[Number(rowKey)]
      }
    })
  })
  return next
}

/**
 * 样式转换为 Univer 水平对齐
 * @param align 对齐
 * @returns Univer 枚举
 */
export function toUniverHorizontalAlign(
  align: LegacyHorizontalAlign
): HorizontalAlign {
  if (align === 'left') return HorizontalAlign.LEFT
  if (align === 'right') return HorizontalAlign.RIGHT
  return HorizontalAlign.CENTER
}

/**
 * 样式转换为 Univer 垂直对齐
 * @param valign 对齐
 * @returns Univer 枚举
 */
export function toUniverVerticalAlign(
  valign: LegacyVerticalAlign
): VerticalAlign {
  if (valign === 'top') return VerticalAlign.TOP
  if (valign === 'bottom') return VerticalAlign.BOTTOM
  return VerticalAlign.MIDDLE
}

/**
 * 从 Univer 枚举还原水平对齐
 * @param align Univer 枚举
 * @returns 对齐
 */
export function fromUniverHorizontalAlign(
  align: IStyleData['ht']
): LegacyHorizontalAlign | undefined {
  if (align === HorizontalAlign.LEFT) return 'left'
  if (align === HorizontalAlign.RIGHT) return 'right'
  if (align === HorizontalAlign.CENTER) return 'center'
  return undefined
}

/**
 * 从 Univer 枚举还原垂直对齐
 * @param valign Univer 枚举
 * @returns 对齐
 */
export function fromUniverVerticalAlign(
  valign: IStyleData['vt']
): LegacyVerticalAlign | undefined {
  if (valign === VerticalAlign.TOP) return 'top'
  if (valign === VerticalAlign.BOTTOM) return 'bottom'
  if (valign === VerticalAlign.MIDDLE) return 'middle'
  return undefined
}

function toUniverBorder(border: CellBorder): NonNullable<IStyleData['bd']> {
  const result: NonNullable<IStyleData['bd']> = {}
  const entries = [
    ['t', border.top],
    ['r', border.right],
    ['b', border.bottom],
    ['l', border.left],
  ] as const
  entries.forEach(([key, value]) => {
    const color = extractColor(value)
    if (color) {
      result[key] = { s: BorderStyleTypes.THIN, cl: { rgb: color } }
    }
  })
  return result
}

function fromUniverBorder(border: IStyleData['bd']): CellBorder | undefined {
  if (!border) return undefined
  const result: CellBorder = {}
  const entries = [
    ['top', border.t],
    ['right', border.r],
    ['bottom', border.b],
    ['left', border.l],
  ] as const
  entries.forEach(([key, value]) => {
    if (!value) return
    const color = value.cl?.rgb ?? '#94a3b8'
    result[key] = `1px solid ${color}`
  })
  return Object.keys(result).length ? result : undefined
}

function extractColor(value?: string) {
  if (!value) return undefined
  const hex = /#([0-9a-f]{3}|[0-9a-f]{6})/i.exec(value)
  if (hex) return `#${hex[1]}`
  const rgb = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(value)
  if (!rgb) return undefined
  return `#${[rgb[1], rgb[2], rgb[3]]
    .map((part) => Number(part).toString(16).padStart(2, '0'))
    .join('')}`
}

/**
 * 旧数字格式转换为 Univer pattern
 * @param numFmt 数字格式
 * @returns pattern
 */
export function numberFormatToPattern(numFmt?: NumberFormat | string) {
  if (!numFmt || numFmt === 'general') return ''
  return NUMBER_PATTERNS[numFmt as NumberFormat] ?? ''
}

function fromPattern(pattern?: string | null): NumberFormat | undefined {
  if (!pattern) return undefined
  if (pattern === NUMBER_PATTERNS.number || pattern === '#,##0') {
    return 'number'
  }
  if (pattern.includes('¥') || pattern.includes('$')) return 'currency'
  if (pattern.includes('%')) return 'percent'
  if (/h/i.test(pattern)) return 'datetime'
  if (/y|m|d/i.test(pattern)) return 'date'
  return undefined
}
