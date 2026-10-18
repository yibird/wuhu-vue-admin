import { columnLabelToIndex, parseCellRef } from '../model/reference'
import type { FormulaRefNode } from './ast'

export type TokenType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'error'
  | 'cell'
  | 'identifier'
  | 'operator'
  | 'lparen'
  | 'rparen'
  | 'comma'
  | 'colon'
  | 'eof'

export interface Token {
  type: TokenType
  value: string
  position: number
  cell?: FormulaRefNode
}

export class FormulaSyntaxError extends Error {
  readonly position: number

  constructor(message: string, position: number) {
    super(message)
    this.name = 'FormulaSyntaxError'
    this.position = position
  }
}

const SHEET_CELL_PATTERN =
  /^(?:'((?:[^']|'')+)'|([A-Za-z_][A-Za-z0-9_]*))!(\$?[A-Za-z]{1,3}\$?\d+)(?![\w])/
const CELL_PATTERN = /^\$?[A-Za-z]{1,3}\$?\d+(?![\w])/
const NUMBER_PATTERN = /^(?:\d+(?:\.\d+)?|\.\d+)/
const STRING_PATTERN = /^"(?:[^"]|"")*"/
const IDENTIFIER_PATTERN = /^[A-Za-z_][A-Za-z0-9_.]*/
const BOOLEAN_PATTERN = /^(TRUE|FALSE)(?![\w])/i
const OPERATOR_PATTERN = /^(?:<>|<=|>=|[-+*/^&=<>])/
const ERROR_PATTERN = /^#(?:REF!|VALUE!|DIV\/0!|NAME\?|CIRC!|N\/A)/

/**
 * 公式分词
 * @param input 公式内容
 * @returns Token 列表
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < input.length) {
    const rest = input.slice(index)
    const char = input[index]

    if (/\s/.test(char)) {
      index += 1
      continue
    }

    const sheetCell = SHEET_CELL_PATTERN.exec(rest)
    if (sheetCell) {
      const sheetName = sheetCell[1]
        ? sheetCell[1].replaceAll("''", "'")
        : sheetCell[2]
      const parsed = parseCellRef(`${sheetCell[3]}`)
      if (!parsed) {
        throw new FormulaSyntaxError('无效的单元格引用', index)
      }
      tokens.push({
        type: 'cell',
        value: sheetCell[0],
        position: index,
        cell: { kind: 'ref', sheet: sheetName, ...omitKind(parsed) },
      })
      index += sheetCell[0].length
      continue
    }

    const cell = CELL_PATTERN.exec(rest)
    if (cell) {
      const parsed = parseCellRef(cell[0])
      if (!parsed) throw new FormulaSyntaxError('无效的单元格引用', index)
      tokens.push({
        type: 'cell',
        value: cell[0],
        position: index,
        cell: { kind: 'ref', sheet: parsed.sheet, ...omitKind(parsed) },
      })
      index += cell[0].length
      continue
    }

    const number = NUMBER_PATTERN.exec(rest)
    if (number) {
      tokens.push({ type: 'number', value: number[0], position: index })
      index += number[0].length
      continue
    }

    const string = STRING_PATTERN.exec(rest)
    if (string) {
      tokens.push({
        type: 'string',
        value: string[0].slice(1, -1).replaceAll('""', '"'),
        position: index,
      })
      index += string[0].length
      continue
    }

    const error = ERROR_PATTERN.exec(rest)
    if (error) {
      tokens.push({ type: 'error', value: error[0], position: index })
      index += error[0].length
      continue
    }

    const boolean = BOOLEAN_PATTERN.exec(rest)
    if (boolean) {
      tokens.push({
        type: 'boolean',
        value: boolean[1].toUpperCase(),
        position: index,
      })
      index += boolean[0].length
      continue
    }

    const identifier = IDENTIFIER_PATTERN.exec(rest)
    if (identifier) {
      tokens.push({
        type: 'identifier',
        value: identifier[0],
        position: index,
      })
      index += identifier[0].length
      continue
    }

    if (char === '(') {
      tokens.push({ type: 'lparen', value: char, position: index })
      index += 1
      continue
    }
    if (char === ')') {
      tokens.push({ type: 'rparen', value: char, position: index })
      index += 1
      continue
    }
    if (char === ',') {
      tokens.push({ type: 'comma', value: char, position: index })
      index += 1
      continue
    }
    if (char === ':') {
      tokens.push({ type: 'colon', value: char, position: index })
      index += 1
      continue
    }

    const operator = OPERATOR_PATTERN.exec(rest)
    if (operator) {
      tokens.push({
        type: 'operator',
        value: operator[0],
        position: index,
      })
      index += operator[0].length
      continue
    }

    throw new FormulaSyntaxError(`无法识别的字符「${char}」`, index)
  }

  tokens.push({ type: 'eof', value: '', position: input.length })
  return tokens
}

function omitKind(parsed: {
  row: number
  col: number
  rowAbsolute: boolean
  colAbsolute: boolean
}) {
  return {
    row: parsed.row,
    col: parsed.col,
    rowAbsolute: parsed.rowAbsolute,
    colAbsolute: parsed.colAbsolute,
  }
}

/**
 * 解析列名(供外部复用)
 */
export { columnLabelToIndex }
