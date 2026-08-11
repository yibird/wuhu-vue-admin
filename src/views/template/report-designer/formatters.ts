import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type {
  FieldFormatPreset,
  FieldType,
  ReportField,
  ReportRow,
} from './types'

export interface FieldFormatOption {
  label: string
  value: FieldFormatPreset
}

interface FormatFieldValueContext {
  field: ReportField
  mappedValue: unknown
  row?: ReportRow
  value: unknown
}

interface FieldFormatResult {
  error: string
  value: string
}

type CustomFormatter = (
  value: unknown,
  mappedValue: unknown,
  row: ReportRow,
  field: ReportField,
  helpers: typeof formatterHelpers
) => unknown

const emptyPlaceholder = '-'
const customFormatterCache = new Map<string, CustomFormatter>()

const fieldFormatPresetOptions: Record<FieldType, FieldFormatOption[]> = {
  string: [
    { label: '去除首尾空格', value: 'text-trim' },
    { label: '转大写', value: 'text-uppercase' },
    { label: '转小写', value: 'text-lowercase' },
  ],
  number: [
    { label: '整数', value: 'number-integer' },
    { label: '1 位小数', value: 'number-decimal-1' },
    { label: '2 位小数', value: 'number-decimal-2' },
    { label: '4 位小数', value: 'number-decimal-4' },
    { label: '紧凑数字', value: 'number-compact' },
  ],
  currency: [
    { label: '人民币无小数', value: 'currency-cny-0' },
    { label: '人民币 2 位小数', value: 'currency-cny-2' },
    { label: '美元 2 位小数', value: 'currency-usd-2' },
    { label: '金额数字 2 位小数', value: 'currency-plain-2' },
  ],
  percent: [
    { label: '百分比整数', value: 'percent-0' },
    { label: '百分比 1 位小数', value: 'percent-1' },
    { label: '百分比 2 位小数', value: 'percent-2' },
  ],
  date: [
    { label: 'YYYY-MM-DD', value: 'date-yyyy-mm-dd' },
    { label: 'YYYY/MM/DD', value: 'date-yyyy-slash-mm-dd' },
    { label: 'YYYY年MM月DD日', value: 'date-cn' },
    { label: 'YYYY-MM-DD HH:mm', value: 'date-yyyy-mm-dd-hh-mm' },
    { label: 'MM-DD', value: 'date-mm-dd' },
    { label: '时间戳', value: 'date-timestamp' },
  ],
}

const formatterHelpers = {
  empty(value: unknown, fallback = emptyPlaceholder) {
    return isEmptyValue(value) ? fallback : value
  },
  formatCurrency(value: unknown, currency = 'CNY', fractionDigits = 2) {
    return formatCurrencyValue(value, currency, fractionDigits)
  },
  formatDate(value: unknown, pattern = 'YYYY-MM-DD') {
    return formatDateValue(value, pattern)
  },
  formatNumber(value: unknown, fractionDigits = 2) {
    return formatNumberValue(value, fractionDigits, fractionDigits)
  },
  formatPercent(value: unknown, fractionDigits = 1) {
    return formatPercentValue(value, fractionDigits)
  },
  toNumber,
}

const allPresetValues = new Set(
  Object.values(fieldFormatPresetOptions)
    .flat()
    .map((option) => option.value)
)

export function getFieldFormatPresetOptions(type: FieldType) {
  return fieldFormatPresetOptions[type] ?? []
}

export function getDefaultCustomFormatterCode(type: FieldType) {
  if (type === 'date') return "return helpers.formatDate(value, 'YYYY-MM-DD')"
  if (type === 'currency')
    return "return helpers.formatCurrency(value, 'CNY', 2)"
  if (type === 'percent') return 'return helpers.formatPercent(value, 1)'
  if (type === 'number') return 'return helpers.formatNumber(value, 2)'
  return "return String(mappedValue ?? value ?? '').trim()"
}

export function isFieldFormatPreset(value: string): value is FieldFormatPreset {
  return allPresetValues.has(value as FieldFormatPreset)
}

export function parseFormatterTestValue(value: string) {
  const text = value.trim()
  if (!text) return ''

  try {
    return JSON.parse(text) as unknown
  } catch {
    return value
  }
}

export function stringifyFormatterTestValue(value: unknown) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function formatFieldValue(context: FormatFieldValueContext): string {
  return runFieldFormat(context).value
}

export function testFieldFormatter(
  context: FormatFieldValueContext
): FieldFormatResult {
  return runFieldFormat(context, true)
}

function runFieldFormat(
  context: FormatFieldValueContext,
  captureError = false
): FieldFormatResult {
  const baseValue = context.mappedValue ?? context.value
  const format = context.field.format

  if (format?.mode === 'custom' && format.customCode?.trim()) {
    try {
      const formatter = getCustomFormatter(format.customCode)
      const row =
        context.row ??
        ({
          [context.field.key]: context.value as ReportRow[string],
        } satisfies ReportRow)
      const value = formatter(
        context.value,
        context.mappedValue,
        row,
        context.field,
        formatterHelpers
      )

      return {
        error: '',
        value: toDisplayText(value),
      }
    } catch (error) {
      return {
        error: captureError ? getErrorMessage(error) : '',
        value: captureError
          ? formatAutoValue(baseValue, context.field)
          : '#FORMAT!',
      }
    }
  }

  if (isEmptyValue(baseValue)) {
    return {
      error: '',
      value: emptyPlaceholder,
    }
  }

  if (format?.mode === 'preset' && format.preset) {
    return {
      error: '',
      value: formatPresetValue(baseValue, context.field, format.preset),
    }
  }

  return {
    error: '',
    value: formatAutoValue(baseValue, context.field),
  }
}

function toNumber(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value.replaceAll(',', '').replaceAll('%', ''))
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function isEmptyValue(value: unknown) {
  return value === null || value === undefined || value === ''
}

function toDisplayText(value: unknown): string {
  if (isEmptyValue(value)) return emptyPlaceholder
  if (value instanceof Date)
    return formatDateValue(value, 'YYYY-MM-DD HH:mm:ss')
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  return String(value)
}

function formatAutoValue(value: unknown, field: ReportField) {
  if (field.type === 'currency') return formatCurrencyValue(value, 'CNY', 2)
  if (field.type === 'percent') return formatPercentValue(value, 1)
  if (field.type === 'number') return formatNumberValue(value, 0, 20)
  if (field.type === 'date') return formatDateValue(value, 'YYYY-MM-DD')
  return toDisplayText(value)
}

function formatPresetValue(
  value: unknown,
  field: ReportField,
  preset: FieldFormatPreset
) {
  if (
    !getFieldFormatPresetOptions(field.type).some(
      (option) => option.value === preset
    )
  ) {
    return formatAutoValue(value, field)
  }

  switch (preset) {
    case 'text-trim':
      return String(value).trim()
    case 'text-uppercase':
      return String(value).toUpperCase()
    case 'text-lowercase':
      return String(value).toLowerCase()
    case 'number-integer':
      return formatNumberValue(value, 0, 0)
    case 'number-decimal-1':
      return formatNumberValue(value, 1, 1)
    case 'number-decimal-2':
      return formatNumberValue(value, 2, 2)
    case 'number-decimal-4':
      return formatNumberValue(value, 4, 4)
    case 'number-compact':
      return new Intl.NumberFormat('zh-CN', {
        maximumFractionDigits: 1,
        notation: 'compact',
      }).format(toNumber(value))
    case 'currency-cny-0':
      return formatCurrencyValue(value, 'CNY', 0)
    case 'currency-cny-2':
      return formatCurrencyValue(value, 'CNY', 2)
    case 'currency-usd-2':
      return formatCurrencyValue(value, 'USD', 2)
    case 'currency-plain-2':
      return formatNumberValue(value, 2, 2)
    case 'percent-0':
      return formatPercentValue(value, 0)
    case 'percent-1':
      return formatPercentValue(value, 1)
    case 'percent-2':
      return formatPercentValue(value, 2)
    case 'date-yyyy-mm-dd':
      return formatDateValue(value, 'YYYY-MM-DD')
    case 'date-yyyy-slash-mm-dd':
      return formatDateValue(value, 'YYYY/MM/DD')
    case 'date-cn':
      return formatDateValue(value, 'YYYY年MM月DD日')
    case 'date-yyyy-mm-dd-hh-mm':
      return formatDateValue(value, 'YYYY-MM-DD HH:mm')
    case 'date-mm-dd':
      return formatDateValue(value, 'MM-DD')
    case 'date-timestamp': {
      const date = parseDateValue(value)
      return date ? String(date.valueOf()) : toDisplayText(value)
    }
  }
}

function formatNumberValue(
  value: unknown,
  minimumFractionDigits: number,
  maximumFractionDigits: number
) {
  return new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(toNumber(value))
}

function formatCurrencyValue(
  value: unknown,
  currency: string,
  fractionDigits: number
) {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'zh-CN', {
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    style: 'currency',
  }).format(toNumber(value))
}

function formatPercentValue(value: unknown, fractionDigits: number) {
  const numberValue = toNumber(value)
  const normalizedValue =
    Math.abs(numberValue) <= 1 ? numberValue * 100 : numberValue
  return `${normalizedValue.toFixed(fractionDigits)}%`
}

function parseDateValue(value: unknown): Dayjs | undefined {
  if (value instanceof Date) {
    const date = dayjs(value)
    return date.isValid() ? date : undefined
  }

  if (typeof value === 'number') {
    const date = dayjs(value)
    return date.isValid() ? date : undefined
  }

  const text = String(value).trim()
  if (!text) return undefined

  if (/^\d{10}$/.test(text)) {
    const date = dayjs(Number(text) * 1000)
    return date.isValid() ? date : undefined
  }

  if (/^\d{13}$/.test(text)) {
    const date = dayjs(Number(text))
    return date.isValid() ? date : undefined
  }

  const date = dayjs(text)
  return date.isValid() ? date : undefined
}

function formatDateValue(value: unknown, pattern: string): string {
  const date = parseDateValue(value)
  return date ? date.format(pattern) : toDisplayText(value)
}

function getCustomFormatter(code: string) {
  const cached = customFormatterCache.get(code)
  if (cached) return cached

  const formatter = createCustomFormatter(code)
  customFormatterCache.set(code, formatter)
  return formatter
}

function createCustomFormatter(code: string): CustomFormatter {
  const trimmedCode = code.trim()
  if (!trimmedCode) {
    return (value) => value
  }

  if (isFunctionExpression(trimmedCode)) {
    const factory = Function(
      `"use strict"; return (${trimmedCode});`
    ) as () => unknown
    const candidate = factory()
    if (typeof candidate !== 'function') {
      throw new Error('Formatter expression must return a function')
    }

    const formatter = candidate as CustomFormatter
    return (value, mappedValue, row, field, helpers) =>
      formatter(value, mappedValue, row, field, helpers)
  }

  return Function(
    'value',
    'mappedValue',
    'row',
    'field',
    'helpers',
    `"use strict";\n${trimmedCode}`
  ) as CustomFormatter
}

function isFunctionExpression(code: string) {
  return (
    /^function\b/.test(code) ||
    /^\(?\s*[\w\s,{}[\].:$?=]+\s*\)?\s*=>/.test(code)
  )
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
