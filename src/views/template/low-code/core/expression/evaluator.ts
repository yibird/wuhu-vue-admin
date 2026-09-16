import { ExpressionError } from './types'
import type {
  ExpressionFunction,
  ExpressionNode,
  ExpressionOptions,
  ExpressionScope,
} from './types'

/**
 * 禁止访问的属性名，避免通过原型链越权。
 * 这些名字在属性访问与成员调用中都会被拒绝。
 */
export const FORBIDDEN_PROPERTIES = new Set([
  '__proto__',
  'prototype',
  'constructor',
  'caller',
  'callee',
  'arguments',
  'eval',
  'Function',
  'globalThis',
  'window',
  'document',
  'process',
  'localStorage',
  'sessionStorage',
  'fetch',
  'XMLHttpRequest',
  'require',
  'module',
  'exports',
  'import',
  'Deno',
  'Bun',
])

/** 白名单成员方法：数组/字符串/数字的常用无副作用方法 */
export const ALLOWED_METHODS = new Set([
  // 查询
  'includes',
  'indexOf',
  'lastIndexOf',
  'find',
  'findIndex',
  'some',
  'every',
  'at',
  'charAt',
  // 转换
  'slice',
  'substring',
  'substr',
  'split',
  'join',
  'concat',
  'flat',
  'flatMap',
  'map',
  'filter',
  'reduce',
  'reduceRight',
  'keys',
  'values',
  'entries',
  // 字符串
  'toUpperCase',
  'toLowerCase',
  'trim',
  'trimStart',
  'trimEnd',
  'startsWith',
  'endsWith',
  'padStart',
  'padEnd',
  'repeat',
  'replace',
  'replaceAll',
  // 数字
  'toFixed',
  'toPrecision',
  'toString',
  'toLocaleString',
])

interface EvaluateState {
  options: ExpressionOptions
  functions: Record<string, ExpressionFunction>
}

function resolveRootIdentifier(name: string, scope: ExpressionScope) {
  if (FORBIDDEN_PROPERTIES.has(name)) return undefined
  return scope[name]
}

function accessMember(object: unknown, property: unknown): unknown {
  if (object === null || object === undefined) return undefined
  const key = String(property)
  if (FORBIDDEN_PROPERTIES.has(key)) {
    throw new ExpressionError(`禁止访问属性 "${key}"`)
  }
  if (typeof object === 'string' && key === 'length') return object.length
  if (Array.isArray(object) && key === 'length') return object.length
  if (object instanceof Map) {
    return key === 'size' ? object.size : undefined
  }
  return (object as Record<string, unknown>)[key]
}

function evaluateNode(node: ExpressionNode, state: EvaluateState): unknown {
  switch (node.type) {
    case 'Literal':
      return node.value

    case 'Identifier':
      return resolveRootIdentifier(node.name, state.options.scope)

    case 'Member': {
      const object = evaluateNode(node.object, state)
      if (object === null || object === undefined) return undefined
      const property = node.computed
        ? evaluateNode(node.property, state)
        : (node.property as { name: string }).name
      return accessMember(object, property)
    }

    case 'Call':
      return evaluateCall(node, state)

    case 'Unary': {
      const value = evaluateNode(node.argument, state)
      if (node.operator === '!') return !value
      if (node.operator === '-') return -(value as number)
      return +(value as number)
    }

    case 'Binary':
      return evaluateBinary(node.operator, node, state)

    case 'Logical': {
      const left = evaluateNode(node.left, state)
      if (node.operator === '&&') {
        return left ? evaluateNode(node.right, state) : left
      }
      if (node.operator === '||') {
        return left ? left : evaluateNode(node.right, state)
      }
      return left === null || left === undefined
        ? evaluateNode(node.right, state)
        : left
    }

    case 'Conditional':
      return evaluateNode(node.test, state)
        ? evaluateNode(node.consequent, state)
        : evaluateNode(node.alternate, state)

    case 'Array':
      return node.elements.map((element) => evaluateNode(element, state))

    case 'Object': {
      const result: Record<string, unknown> = {}
      for (const property of node.properties) {
        result[property.key] = evaluateNode(property.value, state)
      }
      return result
    }

    case 'ArrowFunction':
      return (...args: unknown[]) => {
        const scope: ExpressionScope = { ...state.options.scope }
        node.params.forEach((param, index) => {
          scope[param] = args[index]
        })
        return evaluateNode(node.body, {
          ...state,
          options: { ...state.options, scope },
        })
      }

    default:
      return undefined
  }
}

function evaluateBinary(
  operator: string,
  node: Extract<ExpressionNode, { type: 'Binary' }>,
  state: EvaluateState
) {
  const left = evaluateNode(node.left, state)
  const right = evaluateNode(node.right, state)
  switch (operator) {
    case '+':
      return (left as number) + (right as number)
    case '-':
      return (left as number) - (right as number)
    case '*':
      return (left as number) * (right as number)
    case '/':
      return (left as number) / (right as number)
    case '%':
      return (left as number) % (right as number)
    case '==':
      // eslint-disable-next-line eqeqeq
      return left == right
    case '!=':
      // eslint-disable-next-line eqeqeq
      return left != right
    case '===':
      return left === right
    case '!==':
      return left !== right
    case '<':
      return (left as number) < (right as number)
    case '<=':
      return (left as number) <= (right as number)
    case '>':
      return (left as number) > (right as number)
    case '>=':
      return (left as number) >= (right as number)
    default:
      return undefined
  }
}

function evaluateCall(
  node: Extract<ExpressionNode, { type: 'Call' }>,
  state: EvaluateState
): unknown {
  const args = node.args.map((arg) => evaluateNode(arg, state))

  // 白名单函数：fn(...) 只能调用注册过的函数
  if (node.callee.type === 'Identifier') {
    const fn = state.functions[node.callee.name]
    if (typeof fn !== 'function') {
      throw new ExpressionError(`未授权的函数 "${node.callee.name}"`)
    }
    return fn(...args)
  }

  if (node.callee.type === 'Member') {
    const { object, property } = node.callee
    const target = evaluateNode(object, state)
    if (node.callee.optional && (target === null || target === undefined)) {
      return undefined
    }
    const key = node.callee.computed
      ? String(evaluateNode(property, state))
      : (property as { name: string }).name
    if (FORBIDDEN_PROPERTIES.has(key)) {
      throw new ExpressionError(`禁止调用属性 "${key}"`)
    }
    // functions.formatDate(...) 这类命名空间调用
    if (
      target === state.functions ||
      target === state.options.scope.functions
    ) {
      const fn = state.functions[key]
      if (typeof fn !== 'function') {
        throw new ExpressionError(`未授权的函数 "${key}"`)
      }
      return fn(...args)
    }
    if (!ALLOWED_METHODS.has(key)) {
      throw new ExpressionError(`未授权的方法 "${key}"`)
    }
    if (target === null || target === undefined) return undefined
    const method = (target as Record<string, unknown>)[key]
    if (typeof method !== 'function') {
      throw new ExpressionError(`"${key}" 不是可调用的方法`)
    }
    return (method as (...params: unknown[]) => unknown).apply(target, args)
  }

  throw new ExpressionError('不支持的调用方式')
}

/** 在受控上下文中执行表达式 AST */
export function evaluateAst(
  node: ExpressionNode,
  options: ExpressionOptions
): unknown {
  const state: EvaluateState = {
    options,
    functions: options.functions ?? {},
  }
  return evaluateNode(node, state)
}
