import assert from 'node:assert/strict'
import test from 'node:test'
import {
  columnIndexToLabel,
  columnLabelToIndex,
  formatCellRef,
  parseCellRef,
  toA1Address,
} from '../../src/views/template/report-designer/core/model/reference.ts'

test('列名与列下标互转', () => {
  assert.equal(columnIndexToLabel(0), 'A')
  assert.equal(columnIndexToLabel(25), 'Z')
  assert.equal(columnIndexToLabel(26), 'AA')
  assert.equal(columnLabelToIndex('AA'), 26)
  assert.equal(toA1Address(9, 27), 'AB10')
})

test('解析与格式化单元格引用', () => {
  const parsed = parseCellRef("'销售 报表'!$B$3")
  assert.ok(parsed)
  assert.equal(parsed.sheet, '销售 报表')
  assert.equal(parsed.row, 2)
  assert.equal(parsed.col, 1)
  assert.equal(parsed.rowAbsolute, true)
  assert.equal(parsed.colAbsolute, true)
  assert.equal(formatCellRef(parsed), "'销售 报表'!$B$3")
})
