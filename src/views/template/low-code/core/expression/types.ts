/** Expression 引擎类型定义 */
import type { Expression } from '../schema/types'

export type ExpressionNode =
  | { type: 'Literal'; value: unknown }
  | { type: 'Identifier'; name: string }
  | {
      type: 'Member'
      object: ExpressionNode
      property: ExpressionNode
      computed: boolean
      optional: boolean
    }
  | {
      type: 'Call'
      callee: ExpressionNode
      args: ExpressionNode[]
      optional: boolean
    }
  | { type: 'Unary'; operator: string; argument: ExpressionNode }
  | {
      type: 'Binary'
      operator: string
      left: ExpressionNode
      right: ExpressionNode
    }
  | {
      type: 'Logical'
      operator: string
      left: ExpressionNode
      right: ExpressionNode
    }
  | {
      type: 'Conditional'
      test: ExpressionNode
      consequent: ExpressionNode
      alternate: ExpressionNode
    }
  | { type: 'Array'; elements: ExpressionNode[] }
  | {
      type: 'Object'
      properties: { key: string; value: ExpressionNode }[]
    }
  | { type: 'ArrowFunction'; params: string[]; body: ExpressionNode }

export type ExpressionScope = Record<string, unknown>

export type ExpressionFunction = (...args: unknown[]) => unknown

export interface ExpressionOptions {
  /** 受控上下文：变量访问、属性访问、数组操作均在此查找 */
  scope: ExpressionScope
  /** 白名单函数集合（表达式只能调用这里注册的函数） */
  functions?: Record<string, ExpressionFunction>
  /** 求值失败时的回退值 */
  fallback?: unknown
  /** 是否输出错误日志 */
  silent?: boolean
}

export class ExpressionError extends Error {
  constructor(
    message: string,
    readonly position?: number
  ) {
    super(message)
    this.name = 'ExpressionError'
  }
}

export interface Token {
  type: 'number' | 'string' | 'identifier' | 'punctuation' | 'eof'
  value: string
  start: number
  end: number
}

export type { Expression }
