import type { ICellData, IRange, IWorksheetData } from '@univerjs/core'
import type {
  Band,
  DataRegion,
  ReportDocument,
  ValidationResult,
} from '../../types'
import { extractTemplateExpressions } from '../binding/template'
import type { FormulaNode } from '../formula/ast'
import { isKnownFunction } from '../formula/evaluator'
import { parseFormula } from '../formula/parser'
import { toA1Address } from '../model/reference'

/**
 * 发布前校验报表文档
 * @param document 报表文档
 * @param runtimeErrors 运行时公式错误
 * @returns 校验结果
 */
export function validateReport(
  document: ReportDocument,
  runtimeErrors: string[] = []
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const workbook = document.workbook
  const meta = document.report

  workbook.sheetOrder.forEach((sheetId) => {
    const sheet = workbook.sheets[sheetId]
    if (!sheet) {
      errors.push(`工作表不存在: ${sheetId}`)
      return
    }
    const sheetName = sheet.name ?? 'Sheet'
    const regions = meta.sheets[sheetId]?.regions ?? []
    validateMerges(sheet, sheetName, errors)
    validateRegions(sheet, sheetName, regions, document, errors)
    validateRegionOverlap(sheetName, regions, errors)
    validateCells(sheet, sheetName, document, errors)
  })

  meta.datasets.forEach((dataset) => {
    if (dataset.error) {
      errors.push(`数据集「${dataset.name}」加载失败: ${dataset.error}`)
    }
  })

  runtimeErrors.forEach((message) => {
    if (
      message.includes('#CIRC!') ||
      message.includes('#REF!') ||
      message.includes('#NAME?')
    ) {
      errors.push(message)
    } else {
      warnings.push(message)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

function validateMerges(
  sheet: Partial<IWorksheetData>,
  sheetName: string,
  errors: string[]
) {
  const merges = sheet.mergeData ?? []
  for (let index = 0; index < merges.length; index += 1) {
    const current = merges[index]
    if (
      current.startRow > current.endRow ||
      current.startColumn > current.endColumn
    ) {
      errors.push(`工作表「${sheetName}」存在无效的合并区域`)
    }
    for (let nextIndex = index + 1; nextIndex < merges.length; nextIndex += 1) {
      if (overlaps(current, merges[nextIndex])) {
        errors.push(`工作表「${sheetName}」存在重叠的合并区域`)
      }
    }
  }
}

function overlaps(left: IRange, right: IRange) {
  return (
    left.startRow <= right.endRow &&
    left.endRow >= right.startRow &&
    left.startColumn <= right.endColumn &&
    left.endColumn >= right.startColumn
  )
}

function validateRegions(
  sheet: Partial<IWorksheetData>,
  sheetName: string,
  regions: DataRegion[],
  document: ReportDocument,
  errors: string[]
) {
  const rowCount = sheet.rowCount ?? 0
  regions.forEach((region) => {
    const dataset = document.report.datasets.find(
      (item) =>
        item.id.toLowerCase() === region.datasetId.toLowerCase() ||
        item.name.toLowerCase() === region.datasetId.toLowerCase()
    )
    if (!dataset) {
      errors.push(`数据区域引用的数据集不存在: ${region.datasetId}`)
      return
    }

    const bands: Array<{ label: string; band?: Band }> = [
      { label: '明细', band: region.detail },
      ...region.groups.flatMap((group, index) => [
        { label: `分组 ${index + 1} 头`, band: group.header },
        { label: `分组 ${index + 1} 尾`, band: group.footer },
      ]),
    ]
    bands.forEach(({ label, band }) => {
      if (!band) return
      if (band.startRow > band.endRow) {
        errors.push(`工作表「${sheetName}」${label} Band 起始行大于结束行`)
      }
      if (band.startRow < 0 || band.endRow >= rowCount) {
        errors.push(`工作表「${sheetName}」${label} Band 超出工作表范围`)
      }
    })

    region.groups.forEach((group) => {
      if (!dataset.fields.some((field) => field.key === group.field)) {
        errors.push(`数据区域分组字段不存在: ${group.field}`)
      }
    })
    region.filters.forEach((filter) => {
      if (!dataset.fields.some((field) => field.key === filter.field)) {
        errors.push(`数据区域筛选字段不存在: ${filter.field}`)
      }
    })
    region.sort.forEach((sort) => {
      if (!dataset.fields.some((field) => field.key === sort.field)) {
        errors.push(`数据区域排序字段不存在: ${sort.field}`)
      }
    })
  })
}

function validateRegionOverlap(
  sheetName: string,
  regions: DataRegion[],
  errors: string[]
) {
  const occupied = new Map<number, string>()
  regions.forEach((region, regionIndex) => {
    const bands: Array<{ label: string; band: Band }> = [
      { label: `区域 ${regionIndex + 1} 明细`, band: region.detail },
      ...region.groups.flatMap((group, groupIndex) =>
        [
          {
            label: `区域 ${regionIndex + 1} 分组 ${groupIndex + 1} 头`,
            band: group.header,
          },
          {
            label: `区域 ${regionIndex + 1} 分组 ${groupIndex + 1} 尾`,
            band: group.footer,
          },
        ].filter((item): item is { label: string; band: Band } =>
          Boolean(item.band)
        )
      ),
    ]
    bands.forEach(({ label, band }) => {
      for (let row = band.startRow; row <= band.endRow; row += 1) {
        const existing = occupied.get(row)
        if (existing) {
          errors.push(
            `工作表「${sheetName}」第 ${row + 1} 行被「${existing}」与「${label}」重复占用`
          )
        } else {
          occupied.set(row, label)
        }
      }
    })
  })
}

function validateCells(
  sheet: Partial<IWorksheetData>,
  sheetName: string,
  document: ReportDocument,
  errors: string[]
) {
  Object.entries(sheet.cellData ?? {}).forEach(([rowKey, row]) => {
    const cells = Object.entries(row ?? {}) as Array<
      [string, ICellData | null | undefined]
    >
    cells.forEach(([colKey, cell]) => {
      if (!cell) return
      const address = `${sheetName}!${toA1Address(
        Number(rowKey),
        Number(colKey)
      )}`
      // 单元格公式由 Univer 负责计算与校验,这里只校验报表绑定表达式
      if (typeof cell.v === 'string') {
        extractTemplateExpressions(cell.v).forEach((expression) => {
          validateExpression(expression, document, address, errors)
        })
      }
    })
  })
}

function validateExpression(
  expression: string,
  document: ReportDocument,
  address: string,
  errors: string[]
) {
  try {
    const ast = parseFormula(`=${expression}`)
    collectNames(ast).forEach((name) => {
      if (!resolveName(name, document)) {
        errors.push(`${address} 引用了不存在的名称: ${name}`)
      }
    })
    collectCalls(ast).forEach((name) => {
      if (!isKnownFunction(name)) {
        errors.push(`${address} 使用了不支持的函数: ${name}`)
      }
    })
  } catch {
    errors.push(`${address} 公式或绑定语法错误`)
  }
}

function resolveName(name: string, document: ReportDocument) {
  const lower = name.toLowerCase()
  if (lower.startsWith('params.')) {
    const key = name.slice('params.'.length)
    return document.report.parameters.some(
      (parameter) => parameter.key.toLowerCase() === key.toLowerCase()
    )
  }
  const [datasetKey, fieldKey] = name.split('.')
  if (!datasetKey || !fieldKey) return false
  const dataset = document.report.datasets.find(
    (item) =>
      item.id.toLowerCase() === datasetKey.toLowerCase() ||
      item.name.toLowerCase() === datasetKey.toLowerCase()
  )
  if (!dataset) return false
  return dataset.fields.some(
    (field) => field.key.toLowerCase() === fieldKey.toLowerCase()
  )
}

function collectNames(node: FormulaNode, result: string[] = []) {
  switch (node.kind) {
    case 'name':
      result.push(node.name)
      return result
    case 'call':
      node.args.forEach((arg) => collectNames(arg, result))
      return result
    case 'binary':
      collectNames(node.left, result)
      collectNames(node.right, result)
      return result
    case 'unary':
      collectNames(node.arg, result)
      return result
    default:
      return result
  }
}

function collectCalls(node: FormulaNode, result: string[] = []) {
  switch (node.kind) {
    case 'call':
      result.push(node.name)
      node.args.forEach((arg) => collectCalls(arg, result))
      return result
    case 'binary':
      collectCalls(node.left, result)
      collectCalls(node.right, result)
      return result
    case 'unary':
      collectCalls(node.arg, result)
      return result
    default:
      return result
  }
}
