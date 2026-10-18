import { createUniver, LocaleType } from '@univerjs/presets'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import zhCN from '@univerjs/preset-sheets-core/locales/zh-CN'
import {
  InsertColCommand,
  InsertRowCommand,
  InsertSheetCommand,
  MoveColsCommand,
  MoveRowsCommand,
  RemoveColCommand,
  RemoveRowCommand,
  RemoveSheetCommand,
  SetWorksheetActivateCommand,
  SetWorksheetNameCommand,
} from '@univerjs/sheets'
import '@univerjs/preset-sheets-core/lib/index.css'

export { createUniver, LocaleType, UniverSheetsCorePreset, zhCN }
export { getSheetsEmptySnapshot } from '@univerjs/core'
export type {
  CellValue,
  ICellData,
  IFreeze,
  IRange,
  IStyleData,
  IWorkbookData,
  IWorksheetData,
} from '@univerjs/core'
export type { FUniver } from '@univerjs/core/facade'
export type { FRange, FWorkbook, FWorksheet } from '@univerjs/sheets/facade'

/**
 * 报表设计器需要识别与同步的 Univer 命令
 */
export const REPORT_COMMANDS = {
  insertRow: InsertRowCommand.id,
  removeRow: RemoveRowCommand.id,
  insertColumn: InsertColCommand.id,
  removeColumn: RemoveColCommand.id,
  insertSheet: InsertSheetCommand.id,
  removeSheet: RemoveSheetCommand.id,
  renameSheet: SetWorksheetNameCommand.id,
  activateSheet: SetWorksheetActivateCommand.id,
  moveRows: MoveRowsCommand.id,
  moveColumns: MoveColsCommand.id,
} as const
