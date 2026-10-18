/**
 * Univer 命令 id 常量(与 @univerjs/sheets 1.1.0 保持一致)
 */
export const REPORT_COMMAND_IDS = {
  /**
   * 实际执行行列变更的命令;内置菜单与 facade 最终都会走 by-range 版本
   */
  insertRow: 'sheet.command.insert-row-by-range',
  removeRow: 'sheet.command.remove-row-by-range',
  insertColumn: 'sheet.command.insert-col-by-range',
  removeColumn: 'sheet.command.remove-col-by-range',
  /**
   * 内置菜单对外暴露的命令 id(仅用于脏标记过滤)
   */
  insertRowCommand: 'sheet.command.insert-row',
  removeRowCommand: 'sheet.command.remove-row',
  insertColumnCommand: 'sheet.command.insert-col',
  removeColumnCommand: 'sheet.command.remove-col',
  insertSheet: 'sheet.command.insert-sheet',
  removeSheet: 'sheet.command.remove-sheet',
  renameSheet: 'sheet.command.set-worksheet-name',
  activateSheet: 'sheet.command.set-worksheet-activate',
  moveRows: 'sheet.command.move-rows',
  moveColumns: 'sheet.command.move-cols',
} as const
