import assert from 'node:assert/strict'
import { test } from 'node:test'
import { resolveGridSpan } from '../../src/components/form-plus/src/grid.ts'

test('字段自带 span 时优先使用', () => {
  assert.deepEqual(resolveGridSpan({ cols: 4 }, 24), { span: 24 })
  assert.deepEqual(
    resolveGridSpan({ cols: { lg: 4, xxl: 6 } }, 12),
    { span: 12 },
    '响应式列数下,显式 span 仍是固定占位'
  )
})

test('列数为数字时换算成固定 span', () => {
  assert.deepEqual(resolveGridSpan(1), { span: 24 })
  assert.deepEqual(resolveGridSpan(2), { span: 12 })
  assert.deepEqual(resolveGridSpan(3), { span: 8 })
  assert.deepEqual(resolveGridSpan(4), { span: 6 })
  assert.deepEqual(resolveGridSpan(6), { span: 4 })
})

test('列数非法或未配置时退化为单列铺满', () => {
  assert.deepEqual(resolveGridSpan(undefined), { span: 24 })
  assert.deepEqual(resolveGridSpan(0), { span: 24 })
  assert.deepEqual(resolveGridSpan(-2), { span: 24 })
  assert.deepEqual(resolveGridSpan({}), { span: 24 })
})

test('响应式列数按断点换算 span,并补齐 xs', () => {
  assert.deepEqual(resolveGridSpan({ lg: 4, xxl: 6 }), {
    xs: 6,
    lg: 6,
    xxl: 4,
  })
  assert.deepEqual(resolveGridSpan({ sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 }), {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 8,
    xl: 6,
    xxl: 4,
  })
})

test('响应式列数只声明高断点时,低断点沿用最小已声明列数', () => {
  assert.deepEqual(resolveGridSpan({ xxl: 6 }), { xs: 4, xxl: 4 })
})

test('断点 key 顺序不影响结果', () => {
  assert.deepEqual(
    resolveGridSpan({ xxl: 6, md: 2 }),
    resolveGridSpan({ md: 2, xxl: 6 })
  )
})
