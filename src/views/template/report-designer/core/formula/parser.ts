import { FormulaSyntaxError, tokenize, type Token } from './tokenizer'
import type { FormulaNode, FormulaRangeNode } from './ast'

const PRECEDENCE: Record<string, number> = {
  '=': 1,
  '<>': 1,
  '<': 1,
  '<=': 1,
  '>': 1,
  '>=': 1,
  '&': 2,
  '+': 3,
  '-': 3,
  '*': 4,
  '/': 4,
  '^': 5,
}

// 一元负号低于幂运算,与 Excel 的 =-2^2 => -4 保持一致
const UNARY_PRECEDENCE = 5

class Parser {
  private index = 0
  private readonly tokens: Token[]

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): FormulaNode {
    const node = this.parseExpression(0)
    const token = this.peek()
    if (token.type !== 'eof') {
      throw new FormulaSyntaxError(
        `无法解析的内容「${token.value}」`,
        token.position
      )
    }
    return node
  }

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)]
  }

  private consume(): Token {
    const token = this.tokens[this.index]
    this.index += 1
    return token
  }

  private parseExpression(minPrecedence: number): FormulaNode {
    let left = this.parseUnary()

    while (true) {
      const token = this.peek()
      if (token.type !== 'operator') break
      const precedence = PRECEDENCE[token.value]
      if (precedence === undefined || precedence < minPrecedence) break
      this.consume()
      const right = this.parseExpression(precedence + 1)
      left = { kind: 'binary', op: token.value, left, right }
    }

    return left
  }

  private parseUnary(): FormulaNode {
    const token = this.peek()
    if (
      token.type === 'operator' &&
      (token.value === '+' || token.value === '-')
    ) {
      this.consume()
      return {
        kind: 'unary',
        op: token.value,
        arg: this.parseExpression(UNARY_PRECEDENCE),
      }
    }
    return this.parsePrimary()
  }

  private parsePrimary(): FormulaNode {
    const token = this.consume()

    if (token.type === 'number') {
      return { kind: 'number', value: Number(token.value) }
    }
    if (token.type === 'string') {
      return { kind: 'string', value: token.value }
    }
    if (token.type === 'boolean') {
      return { kind: 'boolean', value: token.value === 'TRUE' }
    }
    if (token.type === 'error') {
      return {
        kind: 'error',
        code: token.value as import('../../types').CellError,
      }
    }

    if (token.type === 'cell' && token.cell) {
      const next = this.peek()
      if (next.type === 'colon') {
        this.consume()
        const endToken = this.consume()
        if (endToken.type !== 'cell' || !endToken.cell) {
          throw new FormulaSyntaxError('区域引用缺少结束单元格', next.position)
        }
        const rowSwapped = token.cell.row > endToken.cell.row
        const colSwapped = token.cell.col > endToken.cell.col
        const range: FormulaRangeNode = {
          kind: 'range',
          sheet: token.cell.sheet ?? endToken.cell.sheet,
          startRow: Math.min(token.cell.row, endToken.cell.row),
          startCol: Math.min(token.cell.col, endToken.cell.col),
          endRow: Math.max(token.cell.row, endToken.cell.row),
          endCol: Math.max(token.cell.col, endToken.cell.col),
          startRowAbsolute: rowSwapped
            ? endToken.cell.rowAbsolute
            : token.cell.rowAbsolute,
          startColAbsolute: colSwapped
            ? endToken.cell.colAbsolute
            : token.cell.colAbsolute,
          endRowAbsolute: rowSwapped
            ? token.cell.rowAbsolute
            : endToken.cell.rowAbsolute,
          endColAbsolute: colSwapped
            ? token.cell.colAbsolute
            : endToken.cell.colAbsolute,
        }
        return range
      }
      return token.cell
    }

    if (token.type === 'identifier') {
      const next = this.peek()
      if (next.type === 'lparen') {
        this.consume()
        const args: FormulaNode[] = []
        if (this.peek().type !== 'rparen') {
          while (true) {
            args.push(this.parseExpression(0))
            if (this.peek().type === 'comma') {
              this.consume()
              continue
            }
            break
          }
        }
        const closing = this.consume()
        if (closing.type !== 'rparen') {
          throw new FormulaSyntaxError('函数调用缺少右括号', closing.position)
        }
        return { kind: 'call', name: token.value.toUpperCase(), args }
      }
      return { kind: 'name', name: token.value }
    }

    if (token.type === 'lparen') {
      const node = this.parseExpression(0)
      const closing = this.consume()
      if (closing.type !== 'rparen') {
        throw new FormulaSyntaxError('表达式缺少右括号', closing.position)
      }
      return node
    }

    throw new FormulaSyntaxError(
      `无法识别的内容「${token.value || '结束'}」`,
      token.position
    )
  }
}

/**
 * 解析公式
 * @param formula 以 = 开头的公式
 * @returns AST
 */
export function parseFormula(formula: string): FormulaNode {
  const source = formula.trim().replace(/^=/, '')
  if (!source) throw new FormulaSyntaxError('公式不能为空', 0)
  return new Parser(tokenize(source)).parse()
}
