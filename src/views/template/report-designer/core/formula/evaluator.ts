import type { ComputedValue, ComputeError } from '../../types'
import type { FormulaNode } from './ast'

export interface FormulaEvalContext {
  /**
   * @desc 读取单元格计算值
   */
  getCell: (
    sheet: string | undefined,
    row: number,
    col: number
  ) => ComputedValue
  /**
   * @desc 读取区域计算值(扁平化)
   */
  getRange: (
    sheet: string | undefined,
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number
  ) => ComputedValue[]
  /**
   * @desc 解析数据集字段 / 参数等名称
   * @param name 名称
   * @param aggregate 是否位于聚合函数参数中
   */
  resolveName: (
    name: string,
    aggregate?: boolean
  ) => ComputedValue | ComputedValue[] | undefined
  /**
   * @desc 当前时间,用于 TODAY/NOW
   */
  now?: Date
  /**
   * @desc 是否处于聚合函数参数中
   */
  aggregate?: boolean
}

export type EvaluatedValue = ComputedValue | ComputedValue[]

export function createError(code: ComputeError['__error']): ComputeError {
  return { __error: code }
}

export function isErrorValue(value: ComputedValue): value is ComputeError {
  return typeof value === 'object' && value !== null && '__error' in value
}

function toScalar(value: EvaluatedValue): ComputedValue {
  return Array.isArray(value) ? createError('#VALUE!') : value
}

export function toNumber(value: ComputedValue): number | ComputeError {
  if (isErrorValue(value)) return value
  if (value === null) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 1 : 0
  const trimmed = value.trim()
  if (!trimmed) return 0
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : createError('#VALUE!')
}

export function toStringValue(value: ComputedValue): string | ComputeError {
  if (isErrorValue(value)) return value
  if (value === null) return ''
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  return String(value)
}

export function toBoolean(value: ComputedValue): boolean | ComputeError {
  if (isErrorValue(value)) return value
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (value === null) return false
  const normalized = value.trim().toUpperCase()
  if (normalized === 'TRUE') return true
  if (normalized === 'FALSE') return false
  if (!normalized) return false
  return createError('#VALUE!')
}

interface FunctionImplementation {
  minArgs: number
  maxArgs?: number
  lazy?: boolean
  /**
   * @desc 是否聚合函数,参数中的数据集字段按行集解析
   */
  aggregate?: boolean
  evaluate: (
    args: FormulaNode[],
    context: FormulaEvalContext,
    evaluateArg: (node: FormulaNode) => EvaluatedValue
  ) => ComputedValue
}

function flattenValues(values: EvaluatedValue[]) {
  const result: ComputedValue[] = []
  values.forEach((value) => {
    if (Array.isArray(value)) result.push(...value)
    else result.push(value)
  })
  return result
}

function numericArgs(values: EvaluatedValue[]): number[] | ComputeError {
  const flattened = flattenValues(values)
  const numbers: number[] = []
  for (const value of flattened) {
    if (isErrorValue(value)) return value
    if (value === null || value === '') continue
    if (typeof value === 'string' && !value.trim()) continue
    const num = toNumber(value)
    if (isErrorValue(num)) return num
    numbers.push(num)
  }
  return numbers
}

/**
 * 注册函数表
 */
const functionTable: Record<string, FunctionImplementation> = {
  SUM: {
    minArgs: 1,
    aggregate: true,
    evaluate: (args, _context, evaluateArg) => sumValues(args.map(evaluateArg)),
  },
  AVERAGE: {
    minArgs: 1,
    aggregate: true,
    evaluate: (args, _context, evaluateArg) => {
      const numbers = numericArgs(args.map(evaluateArg))
      if (!Array.isArray(numbers)) return numbers
      if (!numbers.length) return createError('#DIV/0!')
      return numbers.reduce((total, value) => total + value, 0) / numbers.length
    },
  },
  COUNT: {
    minArgs: 1,
    aggregate: true,
    evaluate: (args, _context, evaluateArg) => {
      const numbers = numericArgs(args.map(evaluateArg))
      return !Array.isArray(numbers) ? numbers : numbers.length
    },
  },
  COUNTA: {
    minArgs: 1,
    aggregate: true,
    evaluate: (args, _context, evaluateArg) =>
      flattenValues(args.map(evaluateArg)).filter(
        (value) => value !== null && value !== ''
      ).length,
  },
  MIN: {
    minArgs: 1,
    aggregate: true,
    evaluate: (args, _context, evaluateArg) => {
      const numbers = numericArgs(args.map(evaluateArg))
      if (!Array.isArray(numbers)) return numbers
      return numbers.length ? Math.min(...numbers) : 0
    },
  },
  MAX: {
    minArgs: 1,
    aggregate: true,
    evaluate: (args, _context, evaluateArg) => {
      const numbers = numericArgs(args.map(evaluateArg))
      if (!Array.isArray(numbers)) return numbers
      return numbers.length ? Math.max(...numbers) : 0
    },
  },
  IF: {
    minArgs: 2,
    maxArgs: 3,
    lazy: true,
    evaluate: (args, _context, evaluateArg) => {
      const condition = toBoolean(toScalar(evaluateArg(args[0])))
      if (isErrorValue(condition)) return condition
      if (condition) return toScalar(evaluateArg(args[1]))
      return args[2] ? toScalar(evaluateArg(args[2])) : false
    },
  },
  AND: {
    minArgs: 1,
    lazy: true,
    evaluate: (args, _context, evaluateArg) => {
      for (const arg of args) {
        const value = toBoolean(toScalar(evaluateArg(arg)))
        if (isErrorValue(value)) return value
        if (!value) return false
      }
      return true
    },
  },
  OR: {
    minArgs: 1,
    lazy: true,
    evaluate: (args, _context, evaluateArg) => {
      for (const arg of args) {
        const value = toBoolean(toScalar(evaluateArg(arg)))
        if (isErrorValue(value)) return value
        if (value) return true
      }
      return false
    },
  },
  NOT: {
    minArgs: 1,
    evaluate: (_args, _context, evaluateArg) => {
      const value = toBoolean(toScalar(evaluateArg(_args[0])))
      return isErrorValue(value) ? value : !value
    },
  },
  ROUND: {
    minArgs: 2,
    evaluate: (args, _context, evaluateArg) => {
      const value = toNumber(toScalar(evaluateArg(args[0])))
      if (isErrorValue(value)) return value
      const digits = toNumber(toScalar(evaluateArg(args[1])))
      if (isErrorValue(digits)) return digits
      const factor = 10 ** Math.trunc(digits)
      return Math.round(value * factor) / factor
    },
  },
  ABS: {
    minArgs: 1,
    evaluate: (_args, _context, evaluateArg) => {
      const value = toNumber(toScalar(evaluateArg(_args[0])))
      return isErrorValue(value) ? value : Math.abs(value)
    },
  },
  CONCAT: {
    minArgs: 1,
    evaluate: (args, _context, evaluateArg) => {
      const parts = flattenValues(args.map(evaluateArg))
      const strings: string[] = []
      for (const part of parts) {
        const text = toStringValue(part)
        if (isErrorValue(text)) return text
        strings.push(text)
      }
      return strings.join('')
    },
  },
  LEFT: {
    minArgs: 1,
    maxArgs: 2,
    evaluate: (args, _context, evaluateArg) => {
      const text = toStringValue(toScalar(evaluateArg(args[0])))
      if (isErrorValue(text)) return text
      const count = args[1] ? toNumber(toScalar(evaluateArg(args[1]))) : 1
      if (isErrorValue(count)) return count
      return text.slice(0, Math.max(0, Math.trunc(count)))
    },
  },
  RIGHT: {
    minArgs: 1,
    maxArgs: 2,
    evaluate: (args, _context, evaluateArg) => {
      const text = toStringValue(toScalar(evaluateArg(args[0])))
      if (isErrorValue(text)) return text
      const count = args[1] ? toNumber(toScalar(evaluateArg(args[1]))) : 1
      if (isErrorValue(count)) return count
      const length = Math.trunc(count)
      return length <= 0 ? '' : text.slice(-length)
    },
  },
  LEN: {
    minArgs: 1,
    evaluate: (_args, _context, evaluateArg) => {
      const text = toStringValue(toScalar(evaluateArg(_args[0])))
      return isErrorValue(text) ? text : text.length
    },
  },
  TODAY: {
    minArgs: 0,
    evaluate: (_args, context) => {
      const now = context.now ?? new Date()
      return formatDate(now)
    },
  },
  NOW: {
    minArgs: 0,
    evaluate: (_args, context) => {
      const now = context.now ?? new Date()
      return `${formatDate(now)} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    },
  },
}

functionTable.AVG = functionTable.AVERAGE as FunctionImplementation

const functions: Record<string, FunctionImplementation> = functionTable

export function isKnownFunction(name: string) {
  return name in functions
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

function sumValues(
  values: Array<ComputedValue | ComputedValue[]>
): ComputedValue {
  const numbers = numericArgs(values)
  if (!Array.isArray(numbers)) return numbers
  return numbers.reduce((total, value) => total + value, 0)
}

export function evaluateFormula(
  node: FormulaNode,
  context: FormulaEvalContext
): EvaluatedValue {
  switch (node.kind) {
    case 'number':
    case 'string':
    case 'boolean':
      return node.value
    case 'error':
      return createError(node.code)
    case 'ref':
      return context.getCell(node.sheet, node.row, node.col)
    case 'range':
      return context.getRange(
        node.sheet,
        node.startRow,
        node.startCol,
        node.endRow,
        node.endCol
      )
    case 'name': {
      const resolved = context.resolveName(node.name, context.aggregate)
      if (resolved === undefined) return createError('#NAME?')
      return resolved
    }
    case 'unary': {
      const value = toNumber(toScalar(evaluateFormula(node.arg, context)))
      if (isErrorValue(value)) return value
      return node.op === '-' ? -value : value
    }
    case 'binary':
      return evaluateBinary(node.op, node.left, node.right, context)
    case 'call': {
      const implementation = functions[node.name]
      if (!implementation) return createError('#NAME?')
      if (node.args.length < implementation.minArgs) {
        return createError('#VALUE!')
      }
      if (
        implementation.maxArgs !== undefined &&
        node.args.length > implementation.maxArgs
      ) {
        return createError('#VALUE!')
      }
      const argContext = implementation.aggregate
        ? { ...context, aggregate: true }
        : context
      return implementation.evaluate(node.args, context, (arg) =>
        evaluateFormula(arg, argContext)
      )
    }
  }
}

function evaluateBinary(
  op: string,
  leftNode: FormulaNode,
  rightNode: FormulaNode,
  context: FormulaEvalContext
): ComputedValue {
  const left = toScalar(evaluateFormula(leftNode, context))
  if (isErrorValue(left)) return left
  const right = toScalar(evaluateFormula(rightNode, context))
  if (isErrorValue(right)) return right

  if (op === '&') {
    const leftText = toStringValue(left)
    if (isErrorValue(leftText)) return leftText
    const rightText = toStringValue(right)
    if (isErrorValue(rightText)) return rightText
    return leftText + rightText
  }

  if (['=', '<>', '<', '<=', '>', '>='].includes(op)) {
    return compareValues(left, right, op)
  }

  const leftNumber = toNumber(left)
  if (isErrorValue(leftNumber)) return leftNumber
  const rightNumber = toNumber(right)
  if (isErrorValue(rightNumber)) return rightNumber

  switch (op) {
    case '+':
      return leftNumber + rightNumber
    case '-':
      return leftNumber - rightNumber
    case '*':
      return leftNumber * rightNumber
    case '/':
      return rightNumber === 0
        ? createError('#DIV/0!')
        : leftNumber / rightNumber
    case '^':
      return leftNumber ** rightNumber
    default:
      return createError('#VALUE!')
  }
}

function compareValues(left: ComputedValue, right: ComputedValue, op: string) {
  let comparison: number
  if (typeof left === 'number' && typeof right === 'number') {
    comparison = left === right ? 0 : left < right ? -1 : 1
  } else if (typeof left === 'boolean' && typeof right === 'boolean') {
    comparison = left === right ? 0 : left ? 1 : -1
  } else {
    const leftText = toStringValue(left)
    if (isErrorValue(leftText)) return leftText
    const rightText = toStringValue(right)
    if (isErrorValue(rightText)) return rightText
    comparison = leftText.localeCompare(rightText)
  }

  switch (op) {
    case '=':
      return comparison === 0
    case '<>':
      return comparison !== 0
    case '<':
      return comparison < 0
    case '<=':
      return comparison <= 0
    case '>':
      return comparison > 0
    case '>=':
      return comparison >= 0
    default:
      return createError('#VALUE!')
  }
}
