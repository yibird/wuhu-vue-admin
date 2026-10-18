import assert from 'node:assert/strict'
import test from 'node:test'
import type { IWorksheetData } from '@univerjs/core'
import {
  createBlankDocument,
  createDefaultDocument,
} from '../../src/views/template/report-designer/data/default-workbook.ts'
import { createPreviewSnapshot } from '../../src/views/template/report-designer/core/preview/expand.ts'
import { validateReport } from '../../src/views/template/report-designer/core/preview/validate.ts'

function sheetOf(
  workbook: { sheets: Record<string, Partial<IWorksheetData>> },
  sheetId: string
) {
  const sheet = workbook.sheets[sheetId]
  assert.ok(sheet)
  return sheet
}

function cellValue(sheet: Partial<IWorksheetData>, row: number, col: number) {
  return sheet.cellData?.[row]?.[col]?.v
}

test('示例文档可以通过发布校验', () => {
  const result = validateReport(createDefaultDocument())
  assert.deepEqual(result.errors, [])
  assert.equal(result.valid, true)
})

test('预览按分组展开明细、分组头尾与总计', () => {
  const document = createDefaultDocument()
  const sheetId = document.workbook.sheetOrder[0]
  const preview = createPreviewSnapshot(document)
  const sheet = sheetOf(preview.workbook, sheetId)

  assert.equal(preview.truncated, false)
  assert.deepEqual(preview.errors, [])
  // 销售报表 200 行展开为 217 行,加说明表 80 行
  assert.equal(preview.rowCount, 297)

  assert.equal(cellValue(sheet, 0, 0), '2026-10 销售明细报表')
  assert.equal(cellValue(sheet, 2, 0), '区域：华东')
  assert.equal(cellValue(sheet, 3, 0), 'SO-2026-1001')
  assert.equal(cellValue(sheet, 6, 6), 296400)
  assert.equal(cellValue(sheet, 22, 6), 1581600)
})

test('预览参数覆盖会影响绑定值', () => {
  const document = createDefaultDocument()
  const sheetId = document.workbook.sheetOrder[0]
  const preview = createPreviewSnapshot(document, { reportMonth: '2026-11' })
  const sheet = sheetOf(preview.workbook, sheetId)
  assert.equal(cellValue(sheet, 0, 0), '2026-11 销售明细报表')
})

test('重叠的数据区域无法通过校验', () => {
  const document = createDefaultDocument()
  const sheetId = document.workbook.sheetOrder[0]
  document.report.sheets[sheetId]?.regions.push({
    id: 'overlap',
    datasetId: 'sales',
    detail: { startRow: 3, endRow: 3 },
    groups: [],
    filters: [],
    sort: [],
  })
  const result = validateReport(document)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((item) => item.includes('重复占用')))
})

test('预览超过行数上限会截断', () => {
  const document = createBlankDocument()
  const sheetId = document.workbook.sheetOrder[0]
  const sheet = document.workbook.sheets[sheetId]
  assert.ok(sheet)
  sheet.rowCount = 30000
  const preview = createPreviewSnapshot(document)
  assert.equal(preview.truncated, true)
  assert.equal(preview.rowCount, 20000)
})
