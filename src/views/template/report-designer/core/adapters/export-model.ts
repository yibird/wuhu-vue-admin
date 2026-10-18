import type {
  CellValue,
  ICellData,
  IRange,
  IWorkbookData,
} from '@univerjs/core'
import type { FWorksheet } from '@univerjs/sheets/facade'
import type {} from '@univerjs/preset-sheets-core'
import type { CellStyle } from '../../types'
import { resolveCellStyle, univerStyleToLegacy } from './snapshot'

export interface ExportCell {
  row: number
  col: number
  value: CellValue | null
  display: string
  formula: string
  style: CellStyle
  numberPattern?: string
  covered: boolean
}

export interface ExportSheet {
  name: string
  rowCount: number
  colCount: number
  cells: Map<string, ExportCell>
  merges: IRange[]
  colWidths: Record<number, number>
  rowHeights: Record<number, number>
  freezeRows: number
  freezeCols: number
}

/**
 * 从 Univer 活动工作表构建导出模型
 * @param snapshot 工作簿快照(用于解析样式)
 * @param sheet Univer 工作表 API
 * @returns 导出模型
 */
export function buildExportSheet(
  snapshot: IWorkbookData,
  sheet: FWorksheet
): ExportSheet {
  const lastRow = Math.max(0, sheet.getLastRow())
  const lastCol = Math.max(0, sheet.getLastColumn())
  const rowCount = lastRow + 1
  const colCount = lastCol + 1
  const range = sheet.getRange(0, 0, rowCount, colCount)
  const values = range.getValues()
  const displays = range.getDisplayValues()
  const formulas = range.getFormulas()
  const numberFormats = range.getNumberFormats()
  const cellData = range.getCellDataGrid()

  const merges = sheet.getMergeData().map((merge) => ({
    startRow: merge.getRow(),
    startColumn: merge.getColumn(),
    endRow: merge.getLastRow(),
    endColumn: merge.getLastColumn(),
  }))
  const covered = buildCovered(merges)
  const cells = new Map<string, ExportCell>()

  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      const key = `${row}:${col}`
      const rawCell = cellData[row]?.[col] ?? null
      const style = univerStyleToLegacy(
        resolveCellStyle(snapshot, rawCell ?? undefined)
      )
      const pattern =
        numberFormats[row]?.[col] ||
        (rawCell
          ? resolveCellStyle(snapshot, rawCell).n?.pattern
          : undefined) ||
        ''

      cells.set(key, {
        row,
        col,
        value: values[row]?.[col] ?? null,
        display: displays[row]?.[col] ?? '',
        formula: formulas[row]?.[col] ?? '',
        style,
        numberPattern: pattern || undefined,
        covered: covered.has(key),
      })
    }
  }

  const colWidths: Record<number, number> = {}
  for (let col = 0; col < colCount; col += 1) {
    colWidths[col] = sheet.getColumnWidth(col)
  }
  const rowHeights: Record<number, number> = {}
  for (let row = 0; row < rowCount; row += 1) {
    rowHeights[row] = sheet.getRowHeight(row)
  }
  const freeze = sheet.getFreeze()

  return {
    name: sheet.getSheetName(),
    rowCount,
    colCount,
    cells,
    merges,
    colWidths,
    rowHeights,
    freezeRows: freeze?.ySplit ?? 0,
    freezeCols: freeze?.xSplit ?? 0,
  }
}

function buildCovered(merges: IRange[]) {
  const covered = new Set<string>()
  merges.forEach((merge) => {
    for (let row = merge.startRow; row <= merge.endRow; row += 1) {
      for (let col = merge.startColumn; col <= merge.endColumn; col += 1) {
        if (row === merge.startRow && col === merge.startColumn) continue
        covered.add(`${row}:${col}`)
      }
    }
  })
  return covered
}

/**
 * 读取单元格
 * @param sheet 导出工作表
 * @param row 行
 * @param col 列
 * @returns 单元格
 */
export function getExportCell(sheet: ExportSheet, row: number, col: number) {
  return sheet.cells.get(`${row}:${col}`)
}

/**
 * 判断单元格是否为空
 * @param cell 导出单元格
 * @returns 是否为空
 */
export function isExportCellEmpty(cell: ExportCell | undefined) {
  return !cell || (cell.value === null && !cell.formula)
}

/**
 * 兼容旧版 ICellData 的样式解析
 * @param snapshot 快照
 * @param cell 单元格
 * @returns 旧样式
 */
export function exportCellStyle(
  snapshot: IWorkbookData,
  cell: ICellData | null | undefined
) {
  return univerStyleToLegacy(resolveCellStyle(snapshot, cell ?? undefined))
}
