import assert from 'node:assert/strict'
import test from 'node:test'
import { isComputeError } from '../../src/views/template/report-designer/types.ts'
import type { TemplateContext } from '../../src/views/template/report-designer/core/binding/template.ts'
import { renderTemplate } from '../../src/views/template/report-designer/core/binding/template.ts'

const context: TemplateContext = {
  datasets: [
    {
      id: 'sales',
      name: '销售',
      source: { kind: 'json', json: '[]' },
      fields: [{ key: 'amount', label: '金额', type: 'number' }],
      rows: [{ amount: 100 }, { amount: 200 }],
    },
  ],
  parameterDefinitions: [
    { key: 'month', label: '月份', type: 'text', defaultValue: '2026-10' },
  ],
  parameters: { month: '2026-11' },
}

test('渲染参数字段', () => {
  assert.equal(
    renderTemplate('月份: {{params.month}}', context),
    '月份: 2026-11'
  )
})

test('渲染当前数据行字段', () => {
  assert.equal(
    renderTemplate('{{sales.amount}}', {
      ...context,
      currentRow: { amount: 100 },
    }),
    100
  )
})

test('聚合函数按分组行集计算', () => {
  const value = renderTemplate('{{SUM(sales.amount)}}', {
    ...context,
    currentRow: { amount: 100 },
    groupRows: [{ amount: 100 }, { amount: 200 }],
  })
  assert.equal(value, 300)
})

test('缺失名称返回错误值', () => {
  const value = renderTemplate('{{params.unknown}}', context)
  assert.ok(isComputeError(value))
  assert.equal(value.__error, '#NAME?')
})
