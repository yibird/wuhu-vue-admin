import type { CellStyle, PrintSettings } from '../../types'
import type { ExportSheet } from '../adapters/export-model'
import { escapeHtml } from './download'

export interface HtmlExportOptions {
  /**
   * @desc 是否输出完整 HTML 文档
   */
  document?: boolean
  /**
   * @desc 打印设置
   */
  print?: PrintSettings
  /**
   * @desc 工作簿名称
   */
  workbookName?: string
}

/**
 * 生成带样式的 HTML 表格
 * @param sheet 导出工作表
 * @param options 导出选项
 * @returns HTML
 */
export function createHtml(
  sheet: ExportSheet,
  options: HtmlExportOptions = {}
) {
  const covered = new Set<string>()
  sheet.merges.forEach((merge) => {
    for (let row = merge.startRow; row <= merge.endRow; row += 1) {
      for (let col = merge.startColumn; col <= merge.endColumn; col += 1) {
        if (row === merge.startRow && col === merge.startColumn) continue
        covered.add(`${row}:${col}`)
      }
    }
  })

  const rows: string[] = []
  for (let row = 0; row < sheet.rowCount; row += 1) {
    const cells: string[] = []
    for (let col = 0; col < sheet.colCount; col += 1) {
      if (covered.has(`${row}:${col}`)) continue
      const cell = sheet.cells.get(`${row}:${col}`)
      const merge = sheet.merges.find(
        (item) => item.startRow === row && item.startColumn === col
      )
      const rowSpan =
        merge && merge.endRow > merge.startRow
          ? ` rowspan="${merge.endRow - merge.startRow + 1}"`
          : ''
      const colSpan =
        merge && merge.endColumn > merge.startColumn
          ? ` colspan="${merge.endColumn - merge.startColumn + 1}"`
          : ''
      const style = cell ? toCssStyle(cell.style) : ''
      const text = cell?.display ?? ''
      cells.push(
        `<td${rowSpan}${colSpan}${style ? ` style="${escapeHtml(style)}"` : ''}>${
          text ? escapeHtml(text) : '&nbsp;'
        }</td>`
      )
    }
    rows.push(`<tr>${cells.join('')}</tr>`)
  }

  const table = `<table class="report-table"><tbody>${rows.join(
    ''
  )}</tbody></table>`
  if (!options.document) return table

  const print = options.print
  const margin = print
    ? print.margins.map((value) => `${value}mm`).join(' ')
    : '12mm'
  const pageSize = print ? `size: ${print.paper} ${print.orientation};` : ''
  const title = `${options.workbookName ?? '报表'} - ${sheet.name}`

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1f2937; }
  .report-table { border-collapse: collapse; width: 100%; table-layout: fixed; }
  .report-table td { padding: 4px 6px; font-size: 12px; overflow: hidden; word-break: break-word; }
  @page { ${pageSize} margin: ${margin}; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>${table}</body>
</html>`
}

export function toCssStyle(style: CellStyle) {
  const css: string[] = []
  if (style.fontFamily) css.push(`font-family:${escapeCss(style.fontFamily)}`)
  if (style.fontSize) css.push(`font-size:${style.fontSize}px`)
  if (style.bold) css.push('font-weight:700')
  if (style.italic) css.push('font-style:italic')
  if (style.underline) css.push('text-decoration:underline')
  if (style.color) css.push(`color:${escapeCss(style.color)}`)
  if (style.fill) css.push(`background-color:${escapeCss(style.fill)}`)
  if (style.align) css.push(`text-align:${style.align}`)
  if (style.valign) css.push(`vertical-align:${style.valign}`)
  if (style.border?.top) css.push(`border-top:${style.border.top}`)
  if (style.border?.right) css.push(`border-right:${style.border.right}`)
  if (style.border?.bottom) css.push(`border-bottom:${style.border.bottom}`)
  if (style.border?.left) css.push(`border-left:${style.border.left}`)
  return css.join(';')
}

function escapeCss(value: string) {
  return value.replace(/[<>"']/g, '')
}
