import assert from 'node:assert/strict'
import test from 'node:test'
import type {
  ExportCell,
  ExportSheet,
} from '../../src/views/template/report-designer/core/adapters/export-model.ts'
import { createCsv } from '../../src/views/template/report-designer/core/io/csv.ts'
import { createHtml } from '../../src/views/template/report-designer/core/io/html.ts'
import { createSpreadsheetMl } from '../../src/views/template/report-designer/core/io/spreadsheetml.ts'

function cell(
  row: number,
  col: number,
  value: string | number,
  extra: Partial<ExportCell> = {}
): ExportCell {
  return {
    row,
    col,
    value,
    display: String(value),
    formula: '',
    style: {},
    covered: false,
    ...extra,
  }
}

function createSheet(): ExportSheet {
  return {
    name: 'Sheet1',
    rowCount: 2,
    colCount: 2,
    cells: new Map([
      ['0:0', cell(0, 0, 'A', { style: { bold: true } })],
      ['0:1', cell(0, 1, 1, { covered: true })],
      ['1:0', cell(1, 0, 2, { formula: '=SUM(B1:B2)' })],
      ['1:1', cell(1, 1, 3, { numberPattern: '#,##0.00' })],
    ]),
    merges: [{ startRow: 0, startColumn: 0, endRow: 0, endColumn: 1 }],
    colWidths: { 0: 120 },
    rowHeights: { 0: 24 },
    freezeRows: 1,
    freezeCols: 0,
  }
}

test('CSV 导出显示值并跳过被合并覆盖的单元格', () => {
  const csv = createCsv(createSheet())
  assert.ok(csv.startsWith('\uFEFF'))
  assert.equal(csv.slice(1), 'A\r\n2,3')
})

test('HTML 导出合并、样式并转义文本', () => {
  const sheet = createSheet()
  sheet.cells.set('1:0', cell(1, 0, '<x>'))
  const html = createHtml(sheet)
  assert.ok(html.includes('colspan="2"'))
  assert.ok(html.includes('font-weight:700'))
  assert.ok(html.includes('&lt;x&gt;'))
  assert.ok(!html.includes('<x>'))
})

test('SpreadsheetML 导出公式、数字格式与冻结', () => {
  const xml = createSpreadsheetMl(createSheet())
  assert.ok(xml.includes('ss:Formula="=SUM(R1C2:R2C2)"'))
  assert.ok(xml.includes('ss:MergeAcross="1"'))
  assert.ok(xml.includes('ss:Format="#,##0.00"'))
  assert.ok(xml.includes('<FreezePanes>'))
})
