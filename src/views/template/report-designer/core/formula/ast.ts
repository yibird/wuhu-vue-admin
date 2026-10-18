export interface FormulaRefNode {
  kind: 'ref'
  sheet?: string
  row: number
  col: number
  rowAbsolute: boolean
  colAbsolute: boolean
}

export interface FormulaRangeNode {
  kind: 'range'
  sheet?: string
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  /**
   * @desc 起始行是否绝对引用
   * @default false
   */
  startRowAbsolute?: boolean
  /**
   * @desc 起始列是否绝对引用
   * @default false
   */
  startColAbsolute?: boolean
  /**
   * @desc 结束行是否绝对引用
   * @default false
   */
  endRowAbsolute?: boolean
  /**
   * @desc 结束列是否绝对引用
   * @default false
   */
  endColAbsolute?: boolean
}

export type FormulaNode =
  | { kind: 'number'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'error'; code: import('../../types').CellError }
  | FormulaRefNode
  | FormulaRangeNode
  | { kind: 'name'; name: string }
  | { kind: 'call'; name: string; args: FormulaNode[] }
  | { kind: 'binary'; op: string; left: FormulaNode; right: FormulaNode }
  | { kind: 'unary'; op: '+' | '-'; arg: FormulaNode }
