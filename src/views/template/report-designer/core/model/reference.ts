export interface ParsedCellRef {
  /**
   * @desc 工作表名,未指定时为当前表
   */
  sheet?: string
  row: number
  col: number
  rowAbsolute: boolean
  colAbsolute: boolean
}

const CELL_REF_PATTERN = /^(\$?)([A-Za-z]{1,3})(\$?)(\d+)$/

/**
 * 列下标转列名
 * @param index 0 基列下标
 * @returns 列名(A, B, ..., AA)
 */
export function columnIndexToLabel(index: number) {
  let value = index + 1
  let label = ''
  while (value > 0) {
    const remainder = (value - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    value = Math.floor((value - 1) / 26)
  }
  return label
}

/**
 * 列名转列下标
 * @param label 列名
 * @returns 0 基列下标
 */
export function columnLabelToIndex(label: string) {
  const upper = label.toUpperCase()
  let index = 0
  for (const char of upper) {
    index = index * 26 + (char.charCodeAt(0) - 64)
  }
  return index - 1
}

/**
 * 单元格 key
 * @param row 行下标
 * @param col 列下标
 * @returns `${row}:${col}`
 */
export function toCellKey(row: number, col: number) {
  return `${row}:${col}`
}

/**
 * 解析单元格 key
 * @param key 单元格 key
 * @returns 行列下标
 */
export function parseCellKey(key: string) {
  const [row, col] = key.split(':').map(Number)
  return { row, col }
}

/**
 * 解析 A1 单元格引用
 * @param reference A1 引用,支持 `$A$1` 与 `Sheet1!A1`
 * @returns 解析结果,非法时返回 undefined
 */
export function parseCellRef(reference: string): ParsedCellRef | undefined {
  const trimmed = reference.trim()
  const bangIndex = findSheetSeparator(trimmed)
  const sheet =
    bangIndex >= 0 ? unquoteSheetName(trimmed.slice(0, bangIndex)) : undefined
  const cellPart = bangIndex >= 0 ? trimmed.slice(bangIndex + 1) : trimmed
  const match = CELL_REF_PATTERN.exec(cellPart)
  if (!match) return undefined

  return {
    sheet,
    colAbsolute: match[1] === '$',
    col: columnLabelToIndex(match[2]),
    rowAbsolute: match[3] === '$',
    row: Number(match[4]) - 1,
  }
}

/**
 * 格式化 A1 引用
 * @param param 解析结果
 * @returns A1 文本
 */
export function formatCellRef(param: ParsedCellRef) {
  const col = `${param.colAbsolute ? '$' : ''}${columnIndexToLabel(param.col)}`
  const row = `${param.rowAbsolute ? '$' : ''}${param.row + 1}`
  const cell = `${col}${row}`
  return param.sheet ? `${quoteSheetName(param.sheet)}!${cell}` : cell
}

/**
 * 格式化单元格地址(无绝对标记)
 * @param row 行下标
 * @param col 列下标
 * @returns A1 文本
 */
export function toA1Address(row: number, col: number) {
  return `${columnIndexToLabel(col)}${row + 1}`
}

function findSheetSeparator(reference: string) {
  let inQuote = false
  for (let index = 0; index < reference.length; index += 1) {
    const char = reference[index]
    if (char === "'") inQuote = !inQuote
    if (char === '!' && !inQuote) return index
  }
  return -1
}

function unquoteSheetName(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'")
  }
  return trimmed
}

export function quoteSheetName(name: string) {
  return /[\s!]/.test(name) ? `'${name.replaceAll("'", "''")}'` : name
}
