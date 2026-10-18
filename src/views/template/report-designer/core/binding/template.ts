import type {
  ComputedValue,
  Dataset,
  ReportParameter,
  Scalar,
} from '../../types'
import {
  createError,
  evaluateFormula,
  isErrorValue,
  type EvaluatedValue,
} from '../formula/evaluator'
import { parseFormula } from '../formula/parser'

export interface TemplateContext {
  datasets: Dataset[]
  parameterDefinitions: ReportParameter[]
  parameters: Record<string, Scalar>
  /**
   * @desc 当前数据行(明细/分组头尾)
   */
  currentRow?: Record<string, Scalar>
  /**
   * @desc 当前分组行集
   */
  groupRows?: Record<string, Scalar>[]
}

const TOKEN_PATTERN = /\{\{([\s\S]+?)\}\}/g

/**
 * 解析模板中的绑定表达式
 * @param text 单元格文本
 * @returns 表达式列表
 */
export function extractTemplateExpressions(text: string) {
  if (!text.includes('{{')) return []
  const expressions: string[] = []
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const expression = match[1]?.trim()
    if (expression) expressions.push(expression)
  }
  return expressions
}

/**
 * 判断是否为纯绑定(整格只有一个表达式)
 * @param text 单元格文本
 * @returns 纯绑定表达式
 */
export function getPureTemplateExpression(text: string) {
  const match = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(text)
  return match?.[1]?.trim()
}

/**
 * 渲染模板
 * @param text 单元格文本
 * @param context 数据上下文
 * @returns 纯绑定返回原始值,混排返回字符串
 */
export function renderTemplate(
  text: string,
  context: TemplateContext
): ComputedValue {
  const pure = getPureTemplateExpression(text)
  if (pure) {
    return evaluateBindingExpression(pure, context)
  }

  if (!text.includes('{{')) return text

  return text.replace(TOKEN_PATTERN, (_match, raw: string) => {
    const value = evaluateBindingExpression(raw.trim(), context)
    return inlineFormat(value)
  })
}

/**
 * 计算绑定表达式
 * @param expression 表达式
 * @param context 数据上下文
 * @returns 计算值
 */
export function evaluateBindingExpression(
  expression: string,
  context: TemplateContext
): ComputedValue {
  if (!expression) return null

  try {
    const ast = parseFormula(`=${expression}`)
    const value = evaluateFormula(ast, {
      getCell: () => null,
      getRange: () => [],
      resolveName: (name, aggregate) =>
        resolveTemplateName(name, context, aggregate),
    })
    return normalizeEvaluatedValue(value)
  } catch {
    return createError('#NAME?')
  }
}

/**
 * 解析数据集字段 / 报表参数名称
 * @param name 名称
 * @param context 数据上下文
 * @param aggregate 是否位于聚合函数参数中
 * @returns 标量或字段值数组
 */
export function resolveTemplateName(
  name: string,
  context: TemplateContext,
  aggregate = false
): EvaluatedValue | undefined {
  const lower = name.toLowerCase()

  if (lower.startsWith('params.')) {
    const key = name.slice('params.'.length)
    const parameter = context.parameterDefinitions.find(
      (item) => item.key.toLowerCase() === key.toLowerCase()
    )
    return parameter ? parameterValue(parameter, context) : undefined
  }

  const [datasetKey, fieldKey] = name.split('.')
  if (!datasetKey || !fieldKey) return undefined
  const dataset = context.datasets.find(
    (item) =>
      item.id.toLowerCase() === datasetKey.toLowerCase() ||
      item.name.toLowerCase() === datasetKey.toLowerCase()
  )
  if (!dataset) return undefined
  const field = dataset.fields.find(
    (item) => item.key.toLowerCase() === fieldKey.toLowerCase()
  )
  if (!field) return undefined

  if (aggregate) {
    const rows =
      context.groupRows && context.groupRows.length
        ? context.groupRows
        : context.currentRow
          ? [context.currentRow]
          : dataset.rows
    return rows.map((row) => (row[field.key] ?? null) as ComputedValue)
  }

  if (context.currentRow) {
    return (context.currentRow[field.key] ?? null) as ComputedValue
  }
  return dataset.rows.map((row) => (row[field.key] ?? null) as ComputedValue)
}

function parameterValue(
  parameter: ReportParameter,
  context: TemplateContext
): ComputedValue {
  const override = context.parameters[parameter.key]
  if (override !== undefined) return override
  if (parameter.type === 'number') {
    const parsed = Number(parameter.defaultValue)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return parameter.defaultValue
}

function normalizeEvaluatedValue(value: EvaluatedValue): ComputedValue {
  if (!Array.isArray(value)) return value
  if (value.length === 0) return null
  if (value.length === 1) return value[0]
  return value.map((item) => inlineFormat(item)).join(', ')
}

/**
 * 行内格式化
 * @param value 计算值
 * @returns 文本
 */
export function inlineFormat(value: ComputedValue) {
  if (isErrorValue(value)) return value.__error
  if (value === null || value === '') return ''
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? value.toLocaleString('zh-CN')
      : value.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  }
  if (typeof value === 'boolean') return value ? '是' : '否'
  return String(value)
}
