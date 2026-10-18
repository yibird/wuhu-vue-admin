import assert from 'node:assert/strict'
import test from 'node:test'
import type { DataRegion } from '../../src/views/template/report-designer/types.ts'
import {
  bandsIntersect,
  regionRowRange,
  shiftRegions,
} from '../../src/views/template/report-designer/core/regions/shift.ts'

function createRegion(): DataRegion {
  return {
    id: 'r1',
    datasetId: 'sales',
    detail: { startRow: 2, endRow: 2 },
    groups: [
      {
        field: 'region',
        header: { startRow: 1, endRow: 1 },
        footer: { startRow: 3, endRow: 3 },
      },
    ],
    filters: [],
    sort: [],
  }
}

test('区域覆盖行范围', () => {
  assert.deepEqual(regionRowRange(createRegion()), [1, 3])
})

test('在上方插入行会整体下移', () => {
  const result = shiftRegions([createRegion()], 'insert', 0, 1).regions
  assert.deepEqual(result[0]?.groups[0]?.header, { startRow: 2, endRow: 2 })
  assert.deepEqual(result[0]?.detail, { startRow: 3, endRow: 3 })
  assert.deepEqual(result[0]?.groups[0]?.footer, { startRow: 4, endRow: 4 })
})

test('在 Band 起始行插入会下移该 Band', () => {
  const result = shiftRegions([createRegion()], 'insert', 2, 1).regions
  assert.deepEqual(result[0]?.groups[0]?.header, { startRow: 1, endRow: 1 })
  assert.deepEqual(result[0]?.detail, { startRow: 3, endRow: 3 })
  assert.deepEqual(result[0]?.groups[0]?.footer, { startRow: 4, endRow: 4 })
})

test('删除上方行会整体上移', () => {
  const result = shiftRegions([createRegion()], 'delete', 0, 1).regions
  assert.deepEqual(result[0]?.groups[0]?.header, { startRow: 0, endRow: 0 })
  assert.deepEqual(result[0]?.detail, { startRow: 1, endRow: 1 })
  assert.deepEqual(result[0]?.groups[0]?.footer, { startRow: 2, endRow: 2 })
})

test('删除明细 Band 会移除整个区域', () => {
  const result = shiftRegions([createRegion()], 'delete', 2, 1)
  assert.equal(result.changed, true)
  assert.equal(result.regions.length, 0)
})

test('判断行区间是否与区域相交', () => {
  const regions = [createRegion()]
  assert.equal(bandsIntersect(regions, 0, 0), false)
  assert.equal(bandsIntersect(regions, 0, 1), true)
  assert.equal(bandsIntersect(regions, 2, 2), true)
  assert.equal(bandsIntersect(regions, 4, 5), false)
})
