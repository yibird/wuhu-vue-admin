import type { ICellData, IFreeze, IRange, IWorksheetData } from '@univerjs/core'
import {
  MAX_ROWS,
  type DataRegion,
  type PreviewResult,
  type ReportDocument,
  type ReportMeta,
  type Scalar,
} from '../../types'
import { renderTemplate, type TemplateContext } from '../binding/template'
import {
  applyRegionFilters,
  applyRegionSort,
  groupRowsByField,
} from '../binding/filters'
import { isErrorValue } from '../formula/evaluator'
import { remapFormulaRows, shiftFormulaRows } from './formula-shift'

interface RenderEntry {
  designRow: number
  outputRow: number
  copy: boolean
  currentRow?: Record<string, Scalar>
  groupRows?: Record<string, Scalar>[]
}

interface RowCell {
  col: number
  cell: ICellData
}

/**
 * 解析报表参数值
 * @param meta 报表元数据
 * @param overrides 预览参数覆盖
 * @returns 参数值
 */
export function resolveParameterValues(
  meta: ReportMeta,
  overrides: Record<string, Scalar> = {}
): Record<string, Scalar> {
  const result: Record<string, Scalar> = {}
  meta.parameters.forEach((parameter) => {
    const value = overrides[parameter.key]
    if (value !== undefined) {
      result[parameter.key] = value
      return
    }
    if (parameter.type === 'number') {
      const parsed = Number(parameter.defaultValue)
      result[parameter.key] = Number.isFinite(parsed) ? parsed : 0
      return
    }
    result[parameter.key] = parameter.defaultValue
  })
  return result
}

/**
 * 生成预览工作簿快照
 * @param document 报表文档
 * @param parameterOverrides 预览参数
 * @returns 展开后的预览结果
 */
export function createPreviewSnapshot(
  document: ReportDocument,
  parameterOverrides: Record<string, Scalar> = {}
): PreviewResult {
  const preview = structuredClone(document.workbook)
  const parameters = resolveParameterValues(document.report, parameterOverrides)
  const errors: string[] = []
  let totalRows = 0
  let truncated = false
  let remaining = MAX_ROWS

  document.workbook.sheetOrder.forEach((sheetId) => {
    const source = document.workbook.sheets[sheetId]
    if (!source) return
    const result = expandSheet(
      source,
      document.report,
      parameters,
      remaining,
      errors
    )
    preview.sheets[sheetId] = result.sheet
    totalRows += result.rowCount
    remaining -= result.rowCount
    if (result.truncated || remaining <= 0) {
      truncated = true
      remaining = Math.max(0, remaining)
    }
  })

  preview.resources = undefined
  preview.custom = undefined
  const activeSheetId = preview.sheetOrder.includes(
    document.report.activeSheetId
  )
    ? document.report.activeSheetId
    : preview.sheetOrder[0]

  return {
    workbook: preview,
    activeSheetId,
    rowCount: totalRows,
    truncated,
    errors,
  }
}

function expandSheet(
  sheet: Partial<IWorksheetData>,
  meta: ReportMeta,
  parameters: Record<string, Scalar>,
  maxRows: number,
  errors: string[]
) {
  const designRowCount = Math.max(1, sheet.rowCount ?? 1)
  const sheetName = sheet.name ?? 'Sheet'
  const cellsByRow = buildCellsByRow(sheet)
  const regions = meta.sheets[sheet.id ?? '']?.regions ?? []
  const regionAt = new Map<number, DataRegion>()
  const occupied = new Set<number>()

  regions.forEach((region) => {
    const start = regionStart(region)
    const end = regionEnd(region)
    if (start === undefined || end === undefined || start > end) {
      errors.push(`工作表「${sheetName}」存在无效的数据区域 Band`)
      return
    }
    regionAt.set(start, region)
    for (let row = start; row <= end; row += 1) occupied.add(row)
  })

  const plan: RenderEntry[] = []
  const rowMappings = new Map<number, number[]>()
  const boundaryRows = new Map<number, number>()
  let writeRow = 0
  let truncated = false

  for (let row = 0; row < designRowCount; row += 1) {
    boundaryRows.set(row, writeRow)
    if (writeRow >= maxRows) {
      truncated = true
      break
    }
    if (occupied.has(row)) {
      const region = regionAt.get(row)
      if (region) {
        const entries = expandRegion(region, meta, errors)
        for (const entry of entries) {
          if (writeRow >= maxRows) {
            truncated = true
            break
          }
          plan.push({
            designRow: entry.designRow,
            outputRow: writeRow,
            copy: true,
            currentRow: entry.currentRow,
            groupRows: entry.groupRows,
          })
          addMapping(rowMappings, entry.designRow, writeRow)
          writeRow += 1
        }
      }
      if (truncated) break
      continue
    }
    plan.push({ designRow: row, outputRow: writeRow, copy: false })
    addMapping(rowMappings, row, writeRow)
    writeRow += 1
  }

  const outCellData: NonNullable<IWorksheetData['cellData']> = {}
  const outRowData: NonNullable<IWorksheetData['rowData']> = {}

  plan.forEach((entry) => {
    renderDesignRow(
      outCellData,
      sheet,
      meta,
      parameters,
      entry,
      cellsByRow,
      rowMappings,
      errors
    )
    const rowMeta = sheet.rowData?.[entry.designRow]
    if (rowMeta) outRowData[entry.outputRow] = { ...rowMeta }
  })

  const rowCount = Math.max(1, writeRow)
  const designFreezeRow = sheet.freeze?.ySplit ?? 0
  const outputFreezeRow = designFreezeRow
    ? (boundaryRows.get(designFreezeRow) ?? designFreezeRow)
    : 0
  const freeze: IFreeze = {
    ...(sheet.freeze ?? {
      startRow: 0,
      startColumn: 0,
      xSplit: 0,
      ySplit: 0,
    }),
    startRow: outputFreezeRow,
    ySplit: outputFreezeRow,
  }

  return {
    sheet: {
      ...sheet,
      rowCount,
      cellData: outCellData,
      rowData: outRowData,
      mergeData: buildPreviewMerges(sheet.mergeData ?? [], rowMappings),
      freeze,
      scrollTop: 0,
      scrollLeft: 0,
    } satisfies Partial<IWorksheetData>,
    rowCount,
    truncated,
  }
}

function buildCellsByRow(sheet: Partial<IWorksheetData>) {
  const map = new Map<number, RowCell[]>()
  Object.entries(sheet.cellData ?? {}).forEach(([rowKey, row]) => {
    const rowIndex = Number(rowKey)
    Object.entries(row ?? {}).forEach(([colKey, cell]) => {
      if (!cell) return
      const list = map.get(rowIndex) ?? []
      list.push({ col: Number(colKey), cell })
      map.set(rowIndex, list)
    })
  })
  map.forEach((list) => list.sort((left, right) => left.col - right.col))
  return map
}

function renderDesignRow(
  target: NonNullable<IWorksheetData['cellData']>,
  source: Partial<IWorksheetData>,
  meta: ReportMeta,
  parameters: Record<string, Scalar>,
  entry: RenderEntry,
  cellsByRow: Map<number, RowCell[]>,
  rowMappings: Map<number, number[]>,
  errors: string[]
) {
  const context: TemplateContext = {
    datasets: meta.datasets,
    parameterDefinitions: meta.parameters,
    parameters,
    currentRow: entry.currentRow,
    groupRows: entry.groupRows,
  }
  const rowCells = cellsByRow.get(entry.designRow) ?? []
  const delta = entry.outputRow - entry.designRow

  rowCells.forEach(({ col, cell }) => {
    const next: ICellData = { ...cell }

    if (cell.f) {
      next.f = entry.copy
        ? shiftFormulaRows(cell.f, delta)
        : remapFormulaRows(cell.f, rowMappings)
      delete next.v
    } else if (typeof cell.v === 'string' && cell.v.includes('{{')) {
      const resolved = renderTemplate(cell.v, context)
      if (isErrorValue(resolved)) {
        next.v = resolved.__error
        errors.push(
          `${source.name ?? 'Sheet'}!${toAddress(entry.outputRow, col)}: ${
            resolved.__error
          }`
        )
      } else {
        next.v = resolved
      }
    }

    target[entry.outputRow] ??= {}
    target[entry.outputRow][col] = next
  })
}

function expandRegion(
  region: DataRegion,
  meta: ReportMeta,
  errors: string[]
): RenderEntry[] {
  const dataset = meta.datasets.find(
    (item) =>
      item.id.toLowerCase() === region.datasetId.toLowerCase() ||
      item.name.toLowerCase() === region.datasetId.toLowerCase()
  )
  if (!dataset) {
    errors.push(`数据区域引用的数据集不存在: ${region.datasetId}`)
    return []
  }

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

  const rows = applyRegionSort(
    applyRegionFilters(dataset.rows, region.filters),
    region.sort
  )
  const entries: RenderEntry[] = []

  const walk = (
    level: number,
    currentRows: Record<string, Scalar>[],
    groupRows: Record<string, Scalar>[]
  ) => {
    if (level >= region.groups.length) {
      currentRows.forEach((row) => {
        for (
          let designRow = region.detail.startRow;
          designRow <= region.detail.endRow;
          designRow += 1
        ) {
          entries.push({
            designRow,
            outputRow: 0,
            copy: true,
            currentRow: row,
            groupRows,
          })
        }
      })
      return
    }

    const group = region.groups[level]
    const groups = groupRowsByField(currentRows, group.field)
    groups.forEach((groupSet) => {
      const first = groupSet[0]
      if (!first) return
      if (group.header) pushBand(entries, group.header, first, groupSet)
      walk(level + 1, groupSet, groupSet)
      if (group.footer) pushBand(entries, group.footer, first, groupSet)
    })
  }

  walk(0, rows, rows)
  return entries
}

function pushBand(
  entries: RenderEntry[],
  band: { startRow: number; endRow: number },
  currentRow: Record<string, Scalar>,
  groupRows: Record<string, Scalar>[]
) {
  for (let row = band.startRow; row <= band.endRow; row += 1) {
    entries.push({
      designRow: row,
      outputRow: 0,
      copy: true,
      currentRow,
      groupRows,
    })
  }
}

function addMapping(
  mappings: Map<number, number[]>,
  designRow: number,
  outputRow: number
) {
  const list = mappings.get(designRow) ?? []
  list.push(outputRow)
  mappings.set(designRow, list)
}

function buildPreviewMerges(merges: IRange[], mappings: Map<number, number[]>) {
  const result: IRange[] = []
  merges.forEach((merge) => {
    const tops = mappings.get(merge.startRow)
    if (!tops?.length) return

    if (merge.startRow === merge.endRow) {
      tops.forEach((top) => {
        result.push({ ...merge, startRow: top, endRow: top })
      })
      return
    }

    const bottoms = mappings.get(merge.endRow)
    if (!bottoms?.length) return
    if (tops.length === bottoms.length && tops.length > 1) {
      tops.forEach((top, index) => {
        const bottom = bottoms[index]
        if (bottom < top) return
        result.push({ ...merge, startRow: top, endRow: bottom })
      })
      return
    }
    const top = tops[0]
    const bottom = bottoms[bottoms.length - 1]
    if (bottom < top) return
    result.push({ ...merge, startRow: top, endRow: bottom })
  })
  return result
}

function regionStart(region: DataRegion): number | undefined {
  const starts = [
    region.detail.startRow,
    ...region.groups.flatMap((group) =>
      [group.header?.startRow, group.footer?.startRow].filter(
        (value): value is number => value !== undefined
      )
    ),
  ]
  return starts.length ? Math.min(...starts) : undefined
}

function regionEnd(region: DataRegion): number | undefined {
  const ends = [
    region.detail.endRow,
    ...region.groups.flatMap((group) =>
      [group.header?.endRow, group.footer?.endRow].filter(
        (value): value is number => value !== undefined
      )
    ),
  ]
  return ends.length ? Math.max(...ends) : undefined
}

function toAddress(row: number, col: number) {
  let value = col + 1
  let label = ''
  while (value > 0) {
    const remainder = (value - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    value = Math.floor((value - 1) / 26)
  }
  return `${label}${row + 1}`
}
