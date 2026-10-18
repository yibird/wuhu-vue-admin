import { debounce } from 'es-toolkit'
import { message } from 'antdv-next'
import type { IWorkbookData } from '@univerjs/core'
import { ThemeMode } from '@/constants'
import { useTheme } from '@/theme'
import {
  MAX_COLS,
  MAX_ROWS,
  MAX_SHEETS,
  SCHEMA_VERSION,
  type CellRange,
  type DataRegion,
  type Dataset,
  type DatasetSource,
  type ReportDocument,
  type ReportMeta,
  type ReportParameter,
  type Scalar,
  type SheetInfo,
  type ValidationResult,
} from '../types'
import {
  createBlankDocument,
  createDefaultDocument,
} from '../data/default-workbook'
import { deriveFields } from '../data/sample-datasets'
import {
  createExportDocument,
  deserializeDocument,
  serializeDocument,
} from '../core/schema/document'
import {
  createPreviewSnapshot,
  resolveParameterValues,
} from '../core/preview/expand'
import { validateReport } from '../core/preview/validate'
import {
  bandsIntersect,
  regionRowRange,
  shiftRegions,
} from '../core/regions/shift'
import { pruneWorkbookData } from '../core/adapters/snapshot'
import { buildExportSheet } from '../core/adapters/export-model'
import { createCsv } from '../core/io/csv'
import { createHtml } from '../core/io/html'
import { createSpreadsheetMl } from '../core/io/spreadsheetml'
import { printHtml } from '../core/io/print'
import { downloadText } from '../core/io/download'
import { createId } from '../core/util/id'
import { toA1Address } from '../core/model/reference'
import { REPORT_COMMAND_IDS } from '../core/univer/commands'
import * as workbookRepository from '../repositories/workbook-repository'
import {
  useUniverWorkbook,
  type SheetSelection,
  type UniverCallbacks,
} from './useUniverWorkbook'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

function loadInitialDocument() {
  return workbookRepository.listDrafts()[0] ?? createDefaultDocument()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function sanitizeFilename(name: string) {
  return (name || 'report').replace(/[\\/:*?"<>|]/g, '_')
}

function regionOverlaps(
  regions: DataRegion[],
  startRow: number,
  endRow: number
) {
  return regions.some((region) => {
    const [start, end] = regionRowRange(region)
    return startRow <= end && endRow >= start
  })
}

export function useReportDesigner() {
  const initial = loadInitialDocument()
  const controller = useUniverWorkbook()
  const { themeMode } = useTheme()
  const darkMode = computed(() => themeMode.value === ThemeMode.Dark)

  const document = shallowRef<ReportDocument>(initial)
  const report = shallowRef<ReportMeta>(initial.report)
  const workbookName = shallowRef(initial.workbook.name)
  const parameterValues = shallowRef<Record<string, Scalar>>(
    resolveParameterValues(initial.report)
  )
  const activeSheetId = shallowRef(initial.report.activeSheetId)
  const sheetInfo = shallowRef<SheetInfo>()
  const selection = shallowRef<SheetSelection>()
  const previewMode = shallowRef(false)
  const previewResult = shallowRef<ReturnType<typeof createPreviewSnapshot>>()
  const designSnapshot = shallowRef<IWorkbookData>()
  const isLoading = shallowRef(false)
  const univerError = shallowRef<string>()
  const autosaveState = shallowRef<AutosaveState>('idle')
  const storageError = shallowRef(workbookRepository.getStorageError())
  const regionSyncDegraded = shallowRef(false)
  const mounted = shallowRef(false)
  let rollingBack = false
  let hadStructuralChange = false
  let degradedNotified = false
  let previewGeneration = 0

  const datasets = computed(() => report.value.datasets)
  const parameters = computed(() => report.value.parameters)
  const regions = computed(
    () => report.value.sheets[activeSheetId.value]?.regions ?? []
  )
  const selectedRange = computed<CellRange | undefined>(
    () => selection.value?.range
  )
  const selectionStats = computed(() => {
    const current = selection.value
    const values = current?.values ?? []
    const displays = current?.displayValues ?? []
    let count = 0
    let numericCount = 0
    let sum = 0
    values.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const display = displays[rowIndex]?.[colIndex]
        if (
          (display === undefined || display === '') &&
          (value === null || value === undefined)
        ) {
          return
        }
        count += 1
        if (typeof value === 'number') {
          numericCount += 1
          sum += value
        }
      })
    })
    return {
      rangeLabel: current?.rangeLabel ?? '',
      count,
      numericCount,
      sum,
      average: numericCount ? sum / numericCount : 0,
    }
  })

  function getSchemaText() {
    const snapshot = controller.save() ?? document.value.workbook
    const current: ReportDocument = {
      schemaVersion: SCHEMA_VERSION,
      workbook: snapshot,
      report: report.value,
    }
    return serializeDocument(createExportDocument(current))
  }

  const callbacks: UniverCallbacks = {
    onDirty: markDirty,
    onCommandExecuted: handleCommand,
    onSelectionChange: (next) => {
      selection.value = next
    },
    onActiveSheetChange: (sheetId) => {
      if (activeSheetId.value !== sheetId) {
        activeSheetId.value = sheetId
        selection.value = undefined
      }
      refreshSheetInfo()
    },
    onUndoRedo: handleUndoRedo,
  }

  const saveDebounced = debounce(() => saveDraftInternal(false), 1200)
  const rebuildPreviewDebounced = debounce(() => {
    void rebuildPreview()
  }, 300)
  const refreshSheetInfoDebounced = debounce(() => refreshSheetInfo(), 150)

  onScopeDispose(() => {
    saveDebounced.cancel()
    rebuildPreviewDebounced.cancel()
    refreshSheetInfoDebounced.cancel()
    controller.dispose()
  })

  watch(darkMode, async () => {
    if (!mounted.value || isLoading.value) return
    const snapshot = previewMode.value
      ? (previewResult.value?.workbook ?? designSnapshot.value)
      : (controller.save() ?? document.value.workbook)
    if (!snapshot) return
    isLoading.value = true
    try {
      await controller.recreate({
        snapshot,
        activeSheetId:
          controller.getActiveSheetId() ?? report.value.activeSheetId,
        readonly: previewMode.value,
        darkMode: darkMode.value,
        callbacks,
      })
    } finally {
      isLoading.value = false
    }
  })

  async function attach(container: HTMLElement) {
    isLoading.value = true
    univerError.value = undefined
    try {
      await controller.mount({
        container,
        snapshot: document.value.workbook,
        activeSheetId: report.value.activeSheetId,
        readonly: false,
        darkMode: darkMode.value,
        callbacks,
      })
      mounted.value = true
      refreshSheetInfo()
    } catch (error) {
      univerError.value =
        error instanceof Error ? error.message : '表格引擎初始化失败'
      message.error(univerError.value)
    } finally {
      isLoading.value = false
    }
  }

  function dispose() {
    mounted.value = false
    controller.dispose()
  }

  function markDirty() {
    if (previewMode.value) return
    autosaveState.value = 'saving'
    saveDebounced()
  }

  function buildDocument(): ReportDocument {
    const snapshot =
      controller.save() ?? structuredClone(document.value.workbook)
    const nextReport = structuredClone(report.value)
    const sheetIds = [...snapshot.sheetOrder]
    const active = controller.getActiveSheetId() ?? nextReport.activeSheetId
    nextReport.activeSheetId = sheetIds.includes(active)
      ? active
      : (sheetIds[0] ?? '')
    const sheets: ReportMeta['sheets'] = {}
    sheetIds.forEach((sheetId) => {
      sheets[sheetId] = nextReport.sheets[sheetId] ?? { regions: [] }
    })
    nextReport.sheets = sheets
    const next: ReportDocument = {
      schemaVersion: SCHEMA_VERSION,
      workbook: pruneWorkbookData(snapshot),
      report: nextReport,
    }
    document.value = next
    report.value = nextReport
    workbookName.value = snapshot.name
    return next
  }

  function saveDraftInternal(notify: boolean) {
    if (previewMode.value) return
    try {
      const next = buildDocument()
      workbookRepository.saveDraft(next)
      autosaveState.value = 'saved'
      if (notify) message.success('草稿已保存')
    } catch {
      autosaveState.value = 'error'
      storageError.value = '保存失败,浏览器存储空间可能已满'
      if (notify) message.error(storageError.value)
    }
  }

  function saveDraft() {
    saveDraftInternal(true)
  }

  function updateReport(updater: (next: ReportMeta) => void) {
    const next = structuredClone(report.value)
    updater(next)
    report.value = next
    refreshSheetInfo()
    markDirty()
  }

  function refreshSheetInfo() {
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    const id = sheet.getSheetId()
    const freeze = sheet.getFreeze()
    activeSheetId.value = id
    sheetInfo.value = {
      id,
      name: sheet.getSheetName(),
      rowCount: sheet.getMaxRows(),
      columnCount: sheet.getMaxColumns(),
      freezeRows: freeze?.ySplit ?? 0,
      freezeCols: freeze?.xSplit ?? 0,
      mergeCount: sheet.getMergeData().length,
      regionCount: report.value.sheets[id]?.regions.length ?? 0,
    }
  }

  function handleCommand(id: string, params: unknown) {
    if (previewMode.value) return
    refreshSheetInfoDebounced()
    const record = isRecord(params) ? params : {}
    const sheetId =
      typeof record.subUnitId === 'string'
        ? record.subUnitId
        : activeSheetId.value

    if (id === REPORT_COMMAND_IDS.insertRow) {
      const range = asRange(record.range)
      if (!range) {
        degradeRegionSync()
        return
      }
      const count = range.endRow - range.startRow + 1
      // UP/DOWN 只影响样式继承方向,插入位置始终是 range.startRow
      applyRowInsert(sheetId, range.startRow, count)
      return
    }

    if (id === REPORT_COMMAND_IDS.removeRow) {
      const ranges = readRowRanges(record)
      if (!ranges.length) {
        degradeRegionSync()
        return
      }
      applyRowDelete(sheetId, ranges)
      return
    }

    if (
      id === REPORT_COMMAND_IDS.moveRows ||
      id === REPORT_COMMAND_IDS.moveColumns
    ) {
      if ((report.value.sheets[sheetId]?.regions.length ?? 0) > 0) {
        rollback('数据区域内不支持移动行列')
      }
      return
    }

    if (id === REPORT_COMMAND_IDS.removeSheet) {
      if ((report.value.sheets[sheetId]?.regions.length ?? 0) > 0) {
        rollback('请先删除该工作表的数据区域')
        return
      }
      if ((controller.getWorkbook()?.getSheets().length ?? 0) < 1) {
        rollback('至少保留一个工作表')
        return
      }
      updateReport((next) => {
        delete next.sheets[sheetId]
      })
      return
    }

    if (id === REPORT_COMMAND_IDS.insertSheet) {
      if ((controller.getWorkbook()?.getSheets().length ?? 0) > MAX_SHEETS) {
        rollback(`最多支持 ${MAX_SHEETS} 个工作表`)
        return
      }
      syncSheetMeta()
    }
  }

  function applyRowInsert(sheetId: string, index: number, count: number) {
    const current = report.value.sheets[sheetId]?.regions ?? []
    if (!current.length) return
    const conflict = current.some((region) => {
      const [start, end] = regionRowRange(region)
      return index > start && index <= end
    })
    if (conflict) {
      rollback('数据区域内部不支持插入行,请先调整区域 Band')
      return
    }
    const result = shiftRegions(current, 'insert', index, count)
    if (!result.changed) return
    updateReport((next) => {
      next.sheets[sheetId] = { regions: result.regions }
    })
    hadStructuralChange = true
  }

  function applyRowDelete(sheetId: string, ranges: CellRange[]) {
    const current = report.value.sheets[sheetId]?.regions ?? []
    if (!current.length) return
    const conflict = ranges.some((range) =>
      bandsIntersect(current, range.startRow, range.endRow)
    )
    if (conflict) {
      rollback('数据区域所在行不支持删除,请先调整区域 Band')
      return
    }
    let nextRegions = current
    let changed = false
    ;[...ranges]
      .sort((left, right) => right.startRow - left.startRow)
      .forEach((range) => {
        const result = shiftRegions(
          nextRegions,
          'delete',
          range.startRow,
          range.endRow - range.startRow + 1
        )
        nextRegions = result.regions
        changed ||= result.changed
      })
    if (!changed) return
    updateReport((next) => {
      next.sheets[sheetId] = { regions: nextRegions }
    })
    hadStructuralChange = true
  }

  function syncSheetMeta() {
    const snapshot = controller.save()
    if (!snapshot) return
    const ids = snapshot.sheetOrder
    updateReport((next) => {
      ids.forEach((id) => {
        next.sheets[id] ??= { regions: [] }
      })
      Object.keys(next.sheets).forEach((id) => {
        if (!ids.includes(id)) delete next.sheets[id]
      })
    })
  }

  function rollback(text: string) {
    if (rollingBack) return
    rollingBack = true
    controller.undo()
    rollingBack = false
    message.warning(text)
  }

  function handleUndoRedo() {
    if (rollingBack) return
    refreshSheetInfo()
    if (hadStructuralChange) {
      regionSyncDegraded.value = true
      if (!degradedNotified) {
        degradedNotified = true
        message.warning('撤销/重做后请检查数据区域 Band 行号')
      }
    }
  }

  function degradeRegionSync() {
    regionSyncDegraded.value = true
    message.warning('无法同步数据区域行号,请在右侧检查区域配置')
  }

  function setParameterValue(key: string, value: Scalar) {
    parameterValues.value = { ...parameterValues.value, [key]: value }
    if (previewMode.value) rebuildPreviewDebounced()
  }

  function addParameter(parameter: ReportParameter) {
    const key = parameter.key.trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      message.warning('参数标识需以字母或下划线开头,只能包含字母、数字和下划线')
      return
    }
    if (
      report.value.parameters.some(
        (item) => item.key.toLowerCase() === key.toLowerCase()
      )
    ) {
      message.warning('参数标识已存在')
      return
    }
    const next = { ...parameter, key }
    updateReport((current) => {
      current.parameters.push(next)
    })
    parameterValues.value = {
      ...parameterValues.value,
      [next.key]:
        next.type === 'number'
          ? Number(next.defaultValue) || 0
          : next.defaultValue,
    }
  }

  function updateParameter(parameter: ReportParameter) {
    updateReport((current) => {
      const index = current.parameters.findIndex(
        (item) => item.key === parameter.key
      )
      if (index >= 0) current.parameters[index] = parameter
    })
    parameterValues.value = {
      ...parameterValues.value,
      [parameter.key]:
        parameter.type === 'number'
          ? Number(parameter.defaultValue) || 0
          : parameter.defaultValue,
    }
  }

  function removeParameter(key: string) {
    updateReport((current) => {
      current.parameters = current.parameters.filter((item) => item.key !== key)
    })
    const next = { ...parameterValues.value }
    delete next[key]
    parameterValues.value = next
  }

  function addDataset(
    name: string,
    rows: Record<string, Scalar>[],
    source: DatasetSource
  ) {
    const dataset: Dataset = {
      id: createId('dataset'),
      name,
      source,
      fields: deriveFields(rows),
      rows,
    }
    updateReport((current) => {
      current.datasets.push(dataset)
    })
    return dataset
  }

  function addDatasetFromJson(name: string, json: string) {
    try {
      const parsed = JSON.parse(json) as unknown
      if (!Array.isArray(parsed)) throw new Error('JSON 必须是对象数组')
      const rows = parsed
        .filter(
          (item): item is Record<string, Scalar> =>
            typeof item === 'object' && item !== null
        )
        .map((item) => ({ ...item }))
      if (!rows.length) throw new Error('JSON 数组不能为空')
      addDataset(name, rows, {
        kind: 'json',
        json: JSON.stringify(rows, null, 2),
      })
      message.success('数据集已创建')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'JSON 数据集解析失败'
      )
    }
  }

  async function addDatasetFromRest(name: string, url: string) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`请求失败: ${response.status}`)
      const parsed = (await response.json()) as unknown
      if (!Array.isArray(parsed)) throw new Error('REST 返回必须是对象数组')
      const rows = parsed
        .filter(
          (item): item is Record<string, Scalar> =>
            typeof item === 'object' && item !== null
        )
        .map((item) => ({ ...item }))
      addDataset(name, rows, { kind: 'rest', url })
      message.success('REST 数据集已加载')
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'REST 数据集加载失败'
      )
    }
  }

  function removeDataset(datasetId: string) {
    const removed = report.value.datasets.find(
      (dataset) => dataset.id === datasetId
    )
    const keys = new Set(
      [datasetId, removed?.name].filter((key): key is string => Boolean(key))
    )
    updateReport((current) => {
      current.datasets = current.datasets.filter(
        (dataset) => dataset.id !== datasetId
      )
      Object.values(current.sheets).forEach((sheet) => {
        sheet.regions = sheet.regions.filter(
          (region) => !keys.has(region.datasetId)
        )
      })
    })
  }

  function createRegionFromSelection(datasetId: string) {
    const range = selectedRange.value
    if (!range) {
      message.warning('请先在表格中选择明细行')
      return undefined
    }
    const startRow = Math.min(range.startRow, range.endRow)
    const endRow = Math.max(range.startRow, range.endRow)
    if (regionOverlaps(regions.value, startRow, endRow)) {
      message.warning('选中行与已有数据区域重叠')
      return undefined
    }
    const region = {
      id: createId('region'),
      datasetId,
      detail: { startRow, endRow },
      groups: [],
      filters: [],
      sort: [],
    }
    updateReport((current) => {
      current.sheets[activeSheetId.value] ??= { regions: [] }
      current.sheets[activeSheetId.value].regions.push(region)
    })
    message.success('数据区域已创建')
    return region
  }

  function updateRegion(regionId: string, patch: Partial<DataRegion>) {
    updateReport((current) => {
      const sheet = current.sheets[activeSheetId.value]
      const region = sheet?.regions.find((item) => item.id === regionId)
      if (region) Object.assign(region, patch)
    })
  }

  function removeRegion(regionId: string) {
    updateReport((current) => {
      const sheet = current.sheets[activeSheetId.value]
      if (!sheet) return
      sheet.regions = sheet.regions.filter((region) => region.id !== regionId)
    })
  }

  function insertField(datasetId: string, fieldKey: string) {
    const range = controller.getActiveSheet()?.getActiveRange()
    if (!range) {
      message.warning('请先选择目标单元格')
      return
    }
    range.setValue(`{{${datasetId}.${fieldKey}}}`)
  }

  function renameWorkbook(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    controller.getWorkbook()?.setName(trimmed)
    workbookName.value = trimmed
    markDirty()
  }

  function renameSheet(sheetId: string, name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    const sheet = controller.getWorkbook()?.getSheetBySheetId(sheetId)
    if (!sheet || sheet.getSheetName() === trimmed) return
    sheet.setName(trimmed)
    refreshSheetInfo()
  }

  function setSheetSize(rowCount: number, columnCount: number) {
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    sheet.setRowCount(clamp(rowCount, 1, MAX_ROWS))
    sheet.setColumnCount(clamp(columnCount, 1, MAX_COLS))
    refreshSheetInfo()
    markDirty()
  }

  function setFreeze(rows: number, cols: number) {
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    if (!rows && !cols) {
      sheet.cancelFreeze()
    } else {
      sheet.setFreeze({
        startRow: rows,
        startColumn: cols,
        xSplit: cols,
        ySplit: rows,
      })
    }
    refreshSheetInfo()
    markDirty()
  }

  function insertRowAtSelection() {
    const range = selectedRange.value
    if (!range) return
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    const start = Math.min(range.startRow, range.endRow)
    const count = Math.abs(range.endRow - range.startRow) + 1
    if (sheet.getMaxRows() + count > MAX_ROWS) {
      message.warning(`最多支持 ${MAX_ROWS} 行`)
      return
    }
    const conflict = regions.value.some((region) => {
      const [bandStart, bandEnd] = regionRowRange(region)
      return start > bandStart && start <= bandEnd
    })
    if (conflict) {
      message.warning('数据区域内部不支持插入行')
      return
    }
    sheet.insertRows(start, count)
  }

  function deleteRowAtSelection() {
    const range = selectedRange.value
    if (!range) return
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    const start = Math.min(range.startRow, range.endRow)
    const end = Math.max(range.startRow, range.endRow)
    if (sheet.getMaxRows() - (end - start + 1) < 1) {
      message.warning('至少保留一行')
      return
    }
    if (bandsIntersect(regions.value, start, end)) {
      message.warning('数据区域所在行不支持删除')
      return
    }
    sheet.deleteRows(start, end - start + 1)
  }

  function insertColumnAtSelection() {
    const range = selectedRange.value
    if (!range) return
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    const start = Math.min(range.startCol, range.endCol)
    const count = Math.abs(range.endCol - range.startCol) + 1
    if (sheet.getMaxColumns() + count > MAX_COLS) {
      message.warning(`最多支持 ${MAX_COLS} 列`)
      return
    }
    sheet.insertColumns(start, count)
  }

  function deleteColumnAtSelection() {
    const range = selectedRange.value
    if (!range) return
    const sheet = controller.getActiveSheet()
    if (!sheet) return
    const start = Math.min(range.startCol, range.endCol)
    const count = Math.abs(range.endCol - range.startCol) + 1
    if (sheet.getMaxColumns() - count < 1) {
      message.warning('至少保留一列')
      return
    }
    sheet.deleteColumns(start, count)
  }

  function undo() {
    controller.undo()
  }

  function redo() {
    controller.redo()
  }

  function validate(): ValidationResult {
    const next = buildDocument()
    const result = validateReport(next, collectRuntimeErrors())
    if (regionSyncDegraded.value) {
      result.warnings.push('撤销/重做后区域 Band 可能已偏移,请检查右侧区域配置')
    }
    return result
  }

  function collectRuntimeErrors() {
    const errors: string[] = []
    const workbook = controller.getWorkbook()
    if (!workbook) return errors
    workbook.getSheets().forEach((sheet) => {
      const rowCount = sheet.getLastRow() + 1
      const colCount = sheet.getLastColumn() + 1
      if (rowCount <= 0 || colCount <= 0) return
      const values = sheet.getRange(0, 0, rowCount, colCount).getDisplayValues()
      values.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (
            /^#(?:REF!|VALUE!|DIV\/0!|NAME\?|N\/A|CIRC!|SPILL|CALC|NUM!)/.test(
              value
            )
          ) {
            errors.push(
              `${sheet.getSheetName()}!${toA1Address(
                rowIndex,
                colIndex
              )} ${value}`
            )
          }
        })
      })
    })
    return errors
  }

  async function enterPreview() {
    if (previewMode.value || isLoading.value) return
    saveDebounced.cancel()
    saveDraftInternal(false)
    isLoading.value = true
    try {
      const snapshot =
        controller.save() ?? structuredClone(document.value.workbook)
      designSnapshot.value = snapshot
      const result = createPreviewSnapshot(
        {
          schemaVersion: SCHEMA_VERSION,
          workbook: snapshot,
          report: {
            ...report.value,
            activeSheetId:
              controller.getActiveSheetId() ?? report.value.activeSheetId,
          },
        },
        parameterValues.value
      )
      previewResult.value = result
      previewMode.value = true
      await controller.recreate({
        snapshot: result.workbook,
        activeSheetId: result.activeSheetId,
        readonly: true,
        darkMode: darkMode.value,
        callbacks,
      })
      if (result.truncated) {
        message.warning(`预览数据超过 ${MAX_ROWS} 行,已截断`)
      }
      if (result.errors.length) {
        message.warning(
          `预览展开有 ${result.errors.length} 个问题: ${result.errors[0]}`
        )
      }
    } catch (error) {
      previewMode.value = false
      message.error(error instanceof Error ? error.message : '进入预览失败')
      if (designSnapshot.value) {
        try {
          await controller.recreate({
            snapshot: designSnapshot.value,
            activeSheetId: report.value.activeSheetId,
            readonly: false,
            darkMode: darkMode.value,
            callbacks,
          })
        } catch {
          // 恢复失败时保留错误提示,用户可刷新页面
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  async function exitPreview() {
    if (!previewMode.value || isLoading.value) return
    isLoading.value = true
    try {
      const snapshot =
        designSnapshot.value ?? structuredClone(document.value.workbook)
      await controller.recreate({
        snapshot,
        activeSheetId: report.value.activeSheetId,
        readonly: false,
        darkMode: darkMode.value,
        callbacks,
      })
    } finally {
      previewMode.value = false
      designSnapshot.value = undefined
      previewResult.value = undefined
      isLoading.value = false
      refreshSheetInfo()
    }
  }

  async function rebuildPreview() {
    if (!previewMode.value || !designSnapshot.value || isLoading.value) return
    const generation = ++previewGeneration
    const result = createPreviewSnapshot(
      {
        schemaVersion: SCHEMA_VERSION,
        workbook: designSnapshot.value,
        report: report.value,
      },
      parameterValues.value
    )
    previewResult.value = result
    isLoading.value = true
    try {
      await controller.recreate({
        snapshot: result.workbook,
        activeSheetId: result.activeSheetId,
        readonly: true,
        darkMode: darkMode.value,
        callbacks,
      })
    } finally {
      if (generation === previewGeneration) isLoading.value = false
    }
  }

  function togglePreview() {
    if (previewMode.value) void exitPreview()
    else void enterPreview()
  }

  function publish() {
    const result = validate()
    if (!result.valid) {
      message.error(`存在 ${result.errors.length} 个阻塞问题,无法发布`)
      return result
    }
    try {
      const next = buildDocument()
      workbookRepository.publishDocument(next)
      workbookRepository.saveDraft(next)
      autosaveState.value = 'saved'
      message.success('报表已发布')
    } catch {
      storageError.value = '发布失败,浏览器存储空间可能已满'
      message.error(storageError.value)
    }
    return result
  }

  async function resetDocument(next: ReportDocument) {
    document.value = next
    report.value = next.report
    workbookName.value = next.workbook.name
    parameterValues.value = resolveParameterValues(next.report)
    activeSheetId.value = next.report.activeSheetId
    previewMode.value = false
    designSnapshot.value = undefined
    previewResult.value = undefined
    regionSyncDegraded.value = false
    hadStructuralChange = false
    degradedNotified = false
    isLoading.value = true
    try {
      await controller.recreate({
        snapshot: next.workbook,
        activeSheetId: next.report.activeSheetId,
        readonly: false,
        darkMode: darkMode.value,
        callbacks,
      })
      refreshSheetInfo()
      markDirty()
    } finally {
      isLoading.value = false
    }
  }

  function newDocument() {
    void resetDocument(createBlankDocument())
    message.success('已新建空白报表')
  }

  function loadSample() {
    void resetDocument(createDefaultDocument())
    message.success('已加载示例报表')
  }

  function importSchema(json: string) {
    const next = deserializeDocument(json)
    if (!next) {
      message.error('Schema 解析失败或版本不兼容')
      return false
    }
    void resetDocument(next)
    message.success('Schema 已导入')
    return true
  }

  function exportSchema() {
    downloadText(
      `${sanitizeFilename(workbookName.value)}.schema.json`,
      getSchemaText(),
      'application/json'
    )
  }

  function exportContext() {
    const snapshot = controller.save()
    const sheet = controller.getActiveSheet()
    if (!snapshot || !sheet) {
      message.warning('表格尚未初始化')
      return undefined
    }
    return { snapshot, sheet: buildExportSheet(snapshot, sheet) }
  }

  function exportCsv() {
    const context = exportContext()
    if (!context) return
    downloadText(
      `${sanitizeFilename(workbookName.value)}-${sanitizeFilename(
        context.sheet.name
      )}.csv`,
      createCsv(context.sheet),
      'text/csv'
    )
  }

  function exportHtml() {
    const context = exportContext()
    if (!context) return
    downloadText(
      `${sanitizeFilename(workbookName.value)}-${sanitizeFilename(
        context.sheet.name
      )}.html`,
      createHtml(context.sheet, {
        document: true,
        print: report.value.print,
        workbookName: workbookName.value,
      }),
      'text/html'
    )
  }

  function exportXls() {
    const context = exportContext()
    if (!context) return
    downloadText(
      `${sanitizeFilename(workbookName.value)}-${sanitizeFilename(
        context.sheet.name
      )}.xls`,
      createSpreadsheetMl(context.sheet),
      'application/vnd.ms-excel'
    )
  }

  function printSheet() {
    const context = exportContext()
    if (!context) return
    printHtml(
      createHtml(context.sheet, {
        document: true,
        print: report.value.print,
        workbookName: workbookName.value,
      })
    )
  }

  return {
    activeSheetId,
    addDatasetFromJson,
    addDatasetFromRest,
    addParameter,
    attach,
    autosaveState,
    createRegionFromSelection,
    datasets,
    deleteColumnAtSelection,
    deleteRowAtSelection,
    dispose,
    exportCsv,
    exportHtml,
    exportSchema,
    exportXls,
    getSchemaText,
    importSchema,
    insertColumnAtSelection,
    insertField,
    insertRowAtSelection,
    isLoading,
    loadSample,
    newDocument,
    parameterValues,
    parameters,
    previewMode,
    previewResult,
    printSheet,
    publish,
    redo,
    refreshSheetInfo,
    regionSyncDegraded,
    regions,
    removeDataset,
    removeParameter,
    removeRegion,
    renameSheet,
    renameWorkbook,
    saveDraft,
    selectedRange,
    selectionStats,
    setFreeze,
    setParameterValue,
    setSheetSize,
    sheetInfo,
    storageError,
    togglePreview,
    undo,
    univerError,
    updateParameter,
    updateRegion,
    validate,
    workbookName,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asRange(value: unknown): CellRange | undefined {
  if (!isRecord(value)) return undefined
  if (
    typeof value.startRow !== 'number' ||
    typeof value.endRow !== 'number' ||
    typeof value.startColumn !== 'number' ||
    typeof value.endColumn !== 'number'
  ) {
    return undefined
  }
  return {
    startRow: value.startRow,
    startCol: value.startColumn,
    endRow: value.endRow,
    endCol: value.endColumn,
  }
}

function readRowRanges(record: Record<string, unknown>): CellRange[] {
  if (Array.isArray(record.ranges)) {
    return record.ranges
      .map((item) => asRange(item))
      .filter((item): item is CellRange => Boolean(item))
  }
  const range = asRange(record.range)
  return range ? [range] : []
}

export type ReportDesignerState = ReturnType<typeof useReportDesigner>
