import assert from 'node:assert/strict'
import test from 'node:test'
import {
  remapFormulaRows,
  shiftFormulaRows,
} from '../../src/views/template/report-designer/core/preview/formula-shift.ts'

test('复制行时平移相对引用', () => {
  assert.equal(
    shiftFormulaRows('=A1+$B$2+SUM(C1:C3)', 2),
    '=A3 + $B$2 + SUM(C3:C5)'
  )
  assert.equal(shiftFormulaRows('=SUM($A$1:B2)', 1), '=SUM($A$1:B3)')
  assert.equal(shiftFormulaRows('=1+2', 3), '=1 + 2')
})

test('按行映射重写引用', () => {
  const mappings = new Map<number, number[]>([
    [1, [10]],
    [2, [11]],
  ])
  assert.equal(remapFormulaRows('=A2+B3', mappings), '=A11 + B12')
  assert.equal(remapFormulaRows('=SUM(A2:B3)', mappings), '=SUM(A11:B12)')
})

test('无法解析的公式保持原样', () => {
  assert.equal(shiftFormulaRows('=VLOOKUP(', 2), '=VLOOKUP(')
  assert.equal(remapFormulaRows('=VLOOKUP(', new Map()), '=VLOOKUP(')
})
