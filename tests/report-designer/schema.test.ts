import assert from 'node:assert/strict'
import test from 'node:test'
import { BooleanNumber } from '@univerjs/core'
import {
  createExportDocument,
  deserializeDocument,
  migrateDocument,
  serializeDocument,
} from '../../src/views/template/report-designer/core/schema/document.ts'
import { createDefaultDocument } from '../../src/views/template/report-designer/data/default-workbook.ts'

const legacyWorkbook = {
  schemaVersion: 2,
  id: 'legacy-workbook',
  name: '旧报表',
  activeSheetId: 'sheet-1',
  styles: {
    money: { bold: true, fontSize: 12, numFmt: 'currency' },
  },
  sheets: [
    {
      id: 'sheet-1',
      name: 'Sheet1',
      rowCount: 100,
      colCount: 10,
      cells: {
        '0:0': { v: '标题', s: 'money' },
        '1:2': { f: '=SUM(A1:A2)' },
      },
      colWidths: { 0: 120 },
      rowHeights: { 0: 30 },
      merges: [{ id: 'm1', top: 0, left: 0, rowSpan: 2, colSpan: 2 }],
      freeze: { rows: 1, cols: 1 },
      regions: [
        {
          id: 'r1',
          datasetId: 'sales',
          detail: { startRow: 2, endRow: 2 },
          groups: [],
          filters: [],
          sort: [],
        },
      ],
    },
  ],
  datasets: [
    {
      id: 'sales',
      name: '销售',
      source: { kind: 'json', json: '[]' },
      fields: [],
      rows: [],
    },
  ],
  parameters: [
    { key: 'month', label: '月份', type: 'text', defaultValue: '2026-10' },
  ],
  print: { paper: 'A4', orientation: 'landscape', margins: [10, 10, 10, 10] },
}

test('拒绝高版本文档', () => {
  assert.equal(
    migrateDocument({
      schemaVersion: 99,
      workbook: { id: 'w', sheetOrder: ['s'], sheets: { s: {} } },
      report: {},
    }),
    undefined
  )
  assert.equal(migrateDocument({}), undefined)
})

test('v2 工作簿迁移到 v3 快照', () => {
  const document = migrateDocument(structuredClone(legacyWorkbook))
  assert.ok(document)
  assert.equal(document.schemaVersion, 3)
  assert.equal(document.workbook.sheetOrder[0], 'sheet-1')
  const sheet = document.workbook.sheets['sheet-1']
  assert.ok(sheet)
  assert.equal(sheet.cellData?.[0]?.[0]?.v, '标题')
  assert.equal(sheet.cellData?.[0]?.[0]?.s, 'money')
  assert.equal(sheet.cellData?.[1]?.[2]?.f, '=SUM(A1:A2)')
  assert.equal(document.workbook.styles.money?.bl, BooleanNumber.TRUE)
  assert.equal(document.workbook.styles.money?.fs, 9)
  assert.equal(document.workbook.styles.money?.n?.pattern, '¥#,##0.00')
  assert.deepEqual(sheet.mergeData, [
    { startRow: 0, startColumn: 0, endRow: 1, endColumn: 1 },
  ])
  assert.deepEqual(sheet.freeze, {
    startRow: 1,
    startColumn: 1,
    xSplit: 1,
    ySplit: 1,
  })
  assert.equal(sheet.rowData?.[0]?.h, 30)
  assert.equal(sheet.columnData?.[0]?.w, 120)
  assert.equal(document.report.sheets['sheet-1']?.regions[0]?.id, 'r1')
  assert.equal(document.report.parameters[0]?.key, 'month')
  assert.equal(document.report.activeSheetId, 'sheet-1')
})

test('v3 文档可以序列化往返', () => {
  const document = createDefaultDocument()
  const restored = deserializeDocument(serializeDocument(document))
  assert.ok(restored)
  assert.equal(restored.workbook.id, document.workbook.id)
  assert.equal(restored.workbook.sheetOrder.length, 2)
  assert.equal(restored.report.datasets.length, 2)
  assert.equal(
    restored.report.sheets[document.workbook.sheetOrder[0]]?.regions.length,
    1
  )
})

test('导出文档会移除 REST 数据集行', () => {
  const document = createDefaultDocument()
  document.report.datasets.push({
    id: 'rest-1',
    name: '远程数据',
    source: { kind: 'rest', url: 'https://example.com/orders' },
    fields: [],
    rows: [{ id: 1 }],
  })
  const exported = createExportDocument(document)
  assert.deepEqual(exported.report.datasets.at(-1)?.rows, [])
  assert.equal(document.report.datasets.at(-1)?.rows.length, 1)
})
