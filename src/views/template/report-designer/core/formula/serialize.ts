import { formatCellRef } from '../model/reference'
import type { FormulaNode } from './ast'

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

/**
 * 将 AST 序列化为公式文本
 * @param node AST
 * @returns 以 = 开头的公式
 */
export function formatFormula(node: FormulaNode) {
  return `=${serialize(node, 0)}`
}

function serialize(node: FormulaNode, parentPrecedence: number): string {
  switch (node.kind) {
    case 'number':
      return String(node.value)
    case 'string':
      return `"${node.value.replaceAll('"', '""')}"`
    case 'boolean':
      return node.value ? 'TRUE' : 'FALSE'
    case 'error':
      return node.code
    case 'name':
      return node.name
    case 'ref':
      return formatCellRef(node)
    case 'range':
      return `${formatCellRef({
        sheet: node.sheet,
        row: node.startRow,
        col: node.startCol,
        rowAbsolute: node.startRowAbsolute ?? false,
        colAbsolute: node.startColAbsolute ?? false,
      })}:${formatCellRef({
        row: node.endRow,
        col: node.endCol,
        rowAbsolute: node.endRowAbsolute ?? false,
        colAbsolute: node.endColAbsolute ?? false,
      })}`
    case 'call':
      return `${node.name}(${node.args
        .map((arg) => serialize(arg, 0))
        .join(',')})`
    case 'unary': {
      const content = `${node.op}${serialize(node.arg, 6)}`
      return parentPrecedence > 6 ? `(${content})` : content
    }
    case 'binary': {
      const precedence = PRECEDENCE[node.op] ?? 0
      const content = `${serialize(node.left, precedence)} ${node.op} ${serialize(
        node.right,
        precedence + 1
      )}`
      return precedence < parentPrecedence ? `(${content})` : content
    }
  }
}
