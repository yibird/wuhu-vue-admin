import type { ExportSheet } from '../adapters/export-model'
import { getExportCell } from '../adapters/export-model'
import { csvEscape } from './download'

/**
 * 生成 CSV
 * @param sheet 导出工作表
 * @returns CSV 文本
 */
export function createCsv(sheet: ExportSheet) {
  const lines: string[] = []

  for (let row = 0; row < sheet.rowCount; row += 1) {
    const cells: string[] = []
    for (let col = 0; col < sheet.colCount; col += 1) {
      const cell = getExportCell(sheet, row, col)
      if (!cell || cell.covered) {
        cells.push('')
        continue
      }
      cells.push(csvEscape(cell.display))
    }
    while (cells.length && cells[cells.length - 1] === '') cells.pop()
    if (cells.length) lines.push(cells.join(','))
  }

  return `\uFEFF${lines.join('\r\n')}`
}
