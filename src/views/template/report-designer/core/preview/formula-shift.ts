import type { FormulaNode } from '../formula/ast'
import { parseFormula } from '../formula/parser'
import { formatFormula } from '../formula/serialize'

/**
 * 按行偏移调整公式中的相对引用(模拟复制单元格)
 * @param formula 公式
 * @param delta 行偏移
 * @returns 调整后的公式
 */
export function shiftFormulaRows(formula: string, delta: number) {
  if (!delta) return formula
  try {
    return formatFormula(shiftNode(parseFormula(formula), delta))
  } catch {
    return formula
  }
}

/**
 * 按设计行到输出行的映射重写公式引用(模拟插入/移动行)
 * @param formula 公式
 * @param mappings 设计行 -> 输出行列表
 * @returns 调整后的公式
 */
export function remapFormulaRows(
  formula: string,
  mappings: Map<number, number[]>
) {
  try {
    return formatFormula(remapNode(parseFormula(formula), mappings))
  } catch {
    return formula
  }
}

function remapNode(
  node: FormulaNode,
  mappings: Map<number, number[]>
): FormulaNode {
  switch (node.kind) {
    case 'ref':
      return { ...node, row: mapRow(node.row, mappings) }
    case 'range':
      return {
        ...node,
        startRow: mapRow(node.startRow, mappings),
        endRow: mapRow(node.endRow, mappings, true),
      }
    case 'call':
      return { ...node, args: node.args.map((arg) => remapNode(arg, mappings)) }
    case 'binary':
      return {
        ...node,
        left: remapNode(node.left, mappings),
        right: remapNode(node.right, mappings),
      }
    case 'unary':
      return { ...node, arg: remapNode(node.arg, mappings) }
    default:
      return node
  }
}

function mapRow(row: number, mappings: Map<number, number[]>, useLast = false) {
  const outputs = mappings.get(row)
  if (!outputs?.length) return row
  return useLast ? outputs[outputs.length - 1] : outputs[0]
}

function shiftNode(node: FormulaNode, delta: number): FormulaNode {
  switch (node.kind) {
    case 'ref':
      return {
        ...node,
        row: node.rowAbsolute ? node.row : Math.max(0, node.row + delta),
      }
    case 'range':
      return {
        ...node,
        startRow: node.startRowAbsolute
          ? node.startRow
          : Math.max(0, node.startRow + delta),
        endRow: node.endRowAbsolute
          ? node.endRow
          : Math.max(0, node.endRow + delta),
      }
    case 'call':
      return { ...node, args: node.args.map((arg) => shiftNode(arg, delta)) }
    case 'binary':
      return {
        ...node,
        left: shiftNode(node.left, delta),
        right: shiftNode(node.right, delta),
      }
    case 'unary':
      return { ...node, arg: shiftNode(node.arg, delta) }
    default:
      return node
  }
}
