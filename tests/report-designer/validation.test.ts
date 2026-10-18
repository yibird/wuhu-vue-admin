import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultDocument } from '../../src/views/template/report-designer/data/default-workbook.ts'
import { validateReport } from '../../src/views/template/report-designer/core/preview/validate.ts'

test('缺失数据集会阻断发布', () => {
  const document = createDefaultDocument()
  const sheetId = document.workbook.sheetOrder[0]
  const region = document.report.sheets[sheetId]?.regions[0]
  assert.ok(region)
  region.datasetId = 'missing'
  const result = validateReport(document)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((item) => item.includes('数据集不存在')))
})

test('Band 越界会阻断发布', () => {
  const document = createDefaultDocument()
  const sheetId = document.workbook.sheetOrder[0]
  const region = document.report.sheets[sheetId]?.regions[0]
  assert.ok(region)
  region.detail.endRow = 99999
  const result = validateReport(document)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((item) => item.includes('超出工作表范围')))
})

test('模板引用不存在的参数会阻断发布', () => {
  const document = createDefaultDocument()
  const sheetId = document.workbook.sheetOrder[0]
  const sheet = document.workbook.sheets[sheetId]
  assert.ok(sheet)
  sheet.cellData ??= {}
  sheet.cellData[10] ??= {}
  sheet.cellData[10][0] = { v: '{{params.notExists}}' }
  const result = validateReport(document)
  assert.equal(result.valid, false)
  assert.ok(result.errors.some((item) => item.includes('不存在的名称')))
})
