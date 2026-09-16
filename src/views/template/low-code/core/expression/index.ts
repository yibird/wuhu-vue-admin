import { expressionFunctions } from './builtins'
import { evaluateAst } from './evaluator'
import { parseExpression } from './parser'
import type { ExpressionNode, ExpressionOptions } from './types'

export { expressionFunctions } from './builtins'
export { ExpressionError } from './types'
export type {
  Expression,
  ExpressionFunction,
  ExpressionNode,
  ExpressionOptions,
  ExpressionScope,
} from './types'
export { ALLOWED_METHODS, FORBIDDEN_PROPERTIES } from './evaluator'

const MAX_CACHE_SIZE = 500
const astCache = new Map<string, ExpressionNode>()
const failedCache = new Set<string>()

/**
 * 编译表达式（带缓存）。解析失败时抛出 ExpressionError。
 */
export function compileExpression(source: string): ExpressionNode {
  const cached = astCache.get(source)
  if (cached) return cached
  if (failedCache.has(source)) {
    throw new Error(`表达式无法解析: ${source}`)
  }
  try {
    const ast = parseExpression(source)
    if (astCache.size >= MAX_CACHE_SIZE) astCache.clear()
    astCache.set(source, ast)
    return ast
  } catch (error) {
    failedCache.add(source)
    throw error
  }
}

/**
 * 在受控上下文中执行表达式，失败时返回 fallback。
 * 这是设计器与 Runtime 统一的表达式入口。
 */
export function evaluateExpression(
  source: string,
  options: ExpressionOptions
): unknown {
  try {
    const ast = compileExpression(source)
    return evaluateAst(ast, {
      ...options,
      functions: options.functions ?? expressionFunctions,
      silent: options.silent ?? true,
    })
  } catch (error) {
    if (!options.silent) {
      console.warn(`[low-code] 表达式执行失败: ${source}`, error)
    }
    return options.fallback
  }
}

/** 校验表达式语法与安全性，供设计器实时提示 */
export function validateExpression(source: string): {
  valid: boolean
  error?: string
} {
  try {
    compileExpression(source)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '表达式无效',
    }
  }
}
