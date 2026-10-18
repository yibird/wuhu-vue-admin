import type { IWorkbookData, Univer } from '@univerjs/core'
import type { FUniver } from '@univerjs/core/facade'
import type { FWorkbook, FWorksheet } from '@univerjs/sheets/facade'
import type { CellRange } from '../types'
import { REPORT_COMMAND_IDS } from '../core/univer/commands'
import { loadUniverRuntime } from '../core/univer/load-runtime'

export interface SheetSelection {
  sheetId: string
  range: CellRange
  rangeLabel: string
  values: unknown[][]
  displayValues: string[][]
}

export interface UniverCallbacks {
  onDirty(): void
  onCommandExecuted(id: string, params: unknown): void
  onSelectionChange(selection: SheetSelection | undefined): void
  onActiveSheetChange(sheetId: string): void
  onUndoRedo(kind: 'undo' | 'redo'): void
}

export interface UniverMountOptions {
  container: HTMLElement
  snapshot: IWorkbookData
  activeSheetId?: string
  readonly?: boolean
  darkMode?: boolean
  callbacks: UniverCallbacks
}

export interface UniverController {
  mount(options: UniverMountOptions): Promise<void>
  recreate(options: Omit<UniverMountOptions, 'container'>): Promise<void>
  dispose(): void
  save(): IWorkbookData | undefined
  getWorkbook(): FWorkbook | undefined
  getActiveSheet(): FWorksheet | undefined
  getActiveSheetId(): string | undefined
  setEditable(editable: boolean): void
  undo(): void
  redo(): void
  insertRows(index: number, count: number): void
  deleteRows(index: number, count: number): void
  insertColumns(index: number, count: number): void
  deleteColumns(index: number, count: number): void
}

export function useUniverWorkbook(): UniverController {
  let univer: Univer | undefined
  let univerAPI: FUniver | undefined
  let container: HTMLElement | undefined
  let callbacks: UniverCallbacks | undefined
  let disposables: Array<{ dispose: () => void }> = []
  let disposed = false
  let generation = 0

  async function mount(options: UniverMountOptions) {
    container = options.container
    callbacks = options.callbacks
    disposed = false
    const token = ++generation
    await createInstance(options, token)
  }

  async function recreate(options: Omit<UniverMountOptions, 'container'>) {
    if (!container) return
    const current = ++generation
    disposeInstance()
    if (disposed || current !== generation) return
    await createInstance(
      {
        ...options,
        container,
      },
      current
    )
  }

  async function createInstance(options: UniverMountOptions, token: number) {
    const runtime = await loadUniverRuntime()
    if (disposed || token !== generation) return
    callbacks = options.callbacks

    const instance = runtime.createUniver({
      locale: runtime.LocaleType.ZH_CN,
      darkMode: options.darkMode ?? false,
      locales: {
        [runtime.LocaleType.ZH_CN]: runtime.zhCN,
      },
      presets: [
        runtime.UniverSheetsCorePreset({
          container: options.container,
          header: false,
          toolbar: !options.readonly,
          formulaBar: !options.readonly,
          contextMenu: true,
          footer: {
            sheetBar: true,
            statisticBar: true,
            menus: true,
            zoomSlider: true,
          },
        }),
      ],
    })

    univer = instance.univer
    univerAPI = instance.univerAPI
    const workbook = univerAPI.createWorkbook(options.snapshot)
    if (
      options.activeSheetId &&
      workbook.getSheetBySheetId(options.activeSheetId)
    ) {
      workbook.setActiveSheet(options.activeSheetId)
    }
    workbook.setEditable(!options.readonly)

    disposables = [
      univerAPI.addEvent(univerAPI.Event.CommandExecuted, (event) => {
        callbacks?.onCommandExecuted(event.id, event.params)
        if (shouldMarkDirty(event.id, event.type)) callbacks?.onDirty()
        if (
          (
            [
              REPORT_COMMAND_IDS.renameSheet,
              REPORT_COMMAND_IDS.activateSheet,
              REPORT_COMMAND_IDS.insertSheet,
              REPORT_COMMAND_IDS.removeSheet,
            ] as string[]
          ).includes(event.id)
        ) {
          const sheet = workbook.getActiveSheet()
          if (sheet) callbacks?.onActiveSheetChange(sheet.getSheetId())
        }
      }),
      univerAPI.addEvent(univerAPI.Event.Undo, () => {
        callbacks?.onUndoRedo('undo')
        callbacks?.onDirty()
      }),
      univerAPI.addEvent(univerAPI.Event.Redo, () => {
        callbacks?.onUndoRedo('redo')
        callbacks?.onDirty()
      }),
      workbook.onSelectionChange(() => emitSelection(workbook)),
    ]

    requestAnimationFrame(() => {
      emitSelection(workbook)
    })
  }

  function emitSelection(workbook: FWorkbook) {
    const sheet = workbook.getActiveSheet()
    if (!sheet) {
      callbacks?.onSelectionChange(undefined)
      return
    }
    const range = sheet.getActiveRange()
    if (!range) {
      callbacks?.onSelectionChange(undefined)
      return
    }
    const selection: CellRange = {
      startRow: range.getRow(),
      startCol: range.getColumn(),
      endRow: range.getLastRow(),
      endCol: range.getLastColumn(),
    }
    const cellCount =
      (selection.endRow - selection.startRow + 1) *
      (selection.endCol - selection.startCol + 1)
    callbacks?.onSelectionChange({
      sheetId: sheet.getSheetId(),
      range: selection,
      rangeLabel: range.getA1Notation(),
      values: cellCount > 5000 ? [] : range.getValues(),
      displayValues: cellCount > 5000 ? [] : range.getDisplayValues(),
    })
    callbacks?.onActiveSheetChange(sheet.getSheetId())
  }

  function shouldMarkDirty(id: string, type: number) {
    // CommandType.MUTATION = 2
    if (type === 2) return true
    if (id.includes('.mutation.')) return true
    return (
      [
        REPORT_COMMAND_IDS.insertRow,
        REPORT_COMMAND_IDS.removeRow,
        REPORT_COMMAND_IDS.insertColumn,
        REPORT_COMMAND_IDS.removeColumn,
        REPORT_COMMAND_IDS.insertRowCommand,
        REPORT_COMMAND_IDS.removeRowCommand,
        REPORT_COMMAND_IDS.insertColumnCommand,
        REPORT_COMMAND_IDS.removeColumnCommand,
        REPORT_COMMAND_IDS.insertSheet,
        REPORT_COMMAND_IDS.removeSheet,
        REPORT_COMMAND_IDS.renameSheet,
        REPORT_COMMAND_IDS.moveRows,
        REPORT_COMMAND_IDS.moveColumns,
      ] as string[]
    ).includes(id)
  }

  function disposeInstance() {
    disposables.forEach((item) => item.dispose())
    disposables = []
    univer?.dispose()
    univer = undefined
    univerAPI = undefined
    container?.replaceChildren()
  }

  function dispose() {
    disposed = true
    generation += 1
    disposeInstance()
    container = undefined
    callbacks = undefined
  }

  function save() {
    return univerAPI?.getActiveWorkbook()?.save()
  }

  function getWorkbook() {
    return univerAPI?.getActiveWorkbook() ?? undefined
  }

  function getActiveSheet() {
    return getWorkbook()?.getActiveSheet()
  }

  function getActiveSheetId() {
    return getActiveSheet()?.getSheetId()
  }

  function setEditable(editable: boolean) {
    getWorkbook()?.setEditable(editable)
  }

  function undo() {
    getWorkbook()?.undo()
  }

  function redo() {
    getWorkbook()?.redo()
  }

  function insertRows(index: number, count: number) {
    getActiveSheet()?.insertRows(index, count)
  }

  function deleteRows(index: number, count: number) {
    getActiveSheet()?.deleteRows(index, count)
  }

  function insertColumns(index: number, count: number) {
    getActiveSheet()?.insertColumns(index, count)
  }

  function deleteColumns(index: number, count: number) {
    getActiveSheet()?.deleteColumns(index, count)
  }

  return {
    mount,
    recreate,
    dispose,
    save,
    getWorkbook,
    getActiveSheet,
    getActiveSheetId,
    setEditable,
    undo,
    redo,
    insertRows,
    deleteRows,
    insertColumns,
    deleteColumns,
  }
}
