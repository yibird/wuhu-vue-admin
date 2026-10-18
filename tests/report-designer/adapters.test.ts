import assert from 'node:assert/strict'
import test from 'node:test'
import type { IWorkbookData } from '@univerjs/core'
import {
  getSnapshotCell,
  legacyStyleToUniver,
  pruneWorkbookData,
  setSnapshotCell,
  univerStyleToLegacy,
} from '../../src/views/template/report-designer/core/adapters/snapshot.ts'

test('旧样式与 Univer 样式互转', () => {
  const style = legacyStyleToUniver({
    fontSize: 16,
    bold: true,
    italic: true,
    underline: true,
    color: '#111111',
    fill: '#eeeeee',
    align: 'center',
    valign: 'middle',
    border: { top: '1px solid #cccccc' },
    numFmt: 'currency',
  })
  assert.equal(style.fs, 12)
  assert.equal(style.bl, 1)
  assert.equal(style.it, 1)
  assert.equal(style.ul?.s, 1)
  assert.equal(style.cl?.rgb, '#111111')
  assert.equal(style.bg?.rgb, '#eeeeee')
  assert.equal(style.ht, 2)
  assert.equal(style.vt, 2)
  assert.equal(style.bd?.t?.s, 1)
  assert.equal(style.n?.pattern, '¥#,##0.00')

  const restored = univerStyleToLegacy(style)
  assert.equal(restored.fontSize, 16)
  assert.equal(restored.bold, true)
  assert.equal(restored.italic, true)
  assert.equal(restored.underline, true)
  assert.equal(restored.align, 'center')
  assert.equal(restored.valign, 'middle')
  assert.equal(restored.numFmt, 'currency')
})

test('快照剪裁会移除空单元格与空行', () => {
  const workbook = {
    id: 'w',
    name: 'W',
    appVersion: '1',
    locale: 'zhCN',
    styles: {},
    sheetOrder: ['s'],
    sheets: {
      s: {
        id: 's',
        name: 'S',
        cellData: {
          0: { 0: { v: 1 }, 1: {} },
          1: {},
        },
      },
    },
  } as unknown as IWorkbookData

  const pruned = pruneWorkbookData(workbook)
  assert.equal(pruned.sheets.s?.cellData?.[0]?.[0]?.v, 1)
  assert.equal(pruned.sheets.s?.cellData?.[0]?.[1], undefined)
  assert.equal(pruned.sheets.s?.cellData?.[1], undefined)
  assert.equal(workbook.sheets.s?.cellData?.[0]?.[1]?.v, undefined)
})

test('读写快照单元格', () => {
  const sheet = { cellData: {} }
  setSnapshotCell(sheet, 1, 2, { v: 'x' })
  assert.equal(getSnapshotCell(sheet, 1, 2)?.v, 'x')
  setSnapshotCell(sheet, 1, 2, undefined)
  assert.equal(getSnapshotCell(sheet, 1, 2), undefined)
})
