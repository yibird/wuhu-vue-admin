import type { ReportRow } from '../types'

type ExpressionToken =
  | { type: 'number'; value: number }
  | { type: 'identifier'; value: string }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' | '%' }
  | { type: 'paren'; value: '(' | ')' }

export function toNumber(value: unknown) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value.replaceAll(',', ''))
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export function isExpressionIdentifier(value: string) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)
}

export function expressionHasIdentifier(expression: string, target: string) {
  if (!isExpressionIdentifier(target)) return false

  let index = 0
  while (index < expression.length) {
    const char = expression[index]
    if (/[A-Za-z_$]/.test(char)) {
      let endIndex = index + 1
      while (/[A-Za-z0-9_$]/.test(expression[endIndex] ?? '')) endIndex += 1
      if (expression.slice(index, endIndex) === target) return true
      index = endIndex
      continue
    }
    index += 1
  }
  return false
}

export function renameExpressionIdentifier(
  expression: string,
  currentKey: string,
  nextKey: string
) {
  if (
    !isExpressionIdentifier(currentKey) ||
    !isExpressionIdentifier(nextKey) ||
    !expressionHasIdentifier(expression, currentKey)
  ) {
    return expression
  }

  let result = ''
  let index = 0
  while (index < expression.length) {
    const char = expression[index]
    if (/[A-Za-z_$]/.test(char)) {
      let endIndex = index + 1
      while (/[A-Za-z0-9_$]/.test(expression[endIndex] ?? '')) endIndex += 1
      const identifier = expression.slice(index, endIndex)
      result += identifier === currentKey ? nextKey : identifier
      index = endIndex
      continue
    }
    result += char
    index += 1
  }
  return result
}

function tokenizeExpression(expression: string, row: ReportRow) {
  const tokens: ExpressionToken[] = []
  const availableKeys = new Set(Object.keys(row))
  let index = 0
  let parenthesisDepth = 0
  let previousToken: ExpressionToken | undefined

  while (index < expression.length) {
    const char = expression[index]
    if (/\s/.test(char)) {
      index += 1
      continue
    }

    const canStartSignedNumber =
      (char === '-' || char === '+') &&
      /\d/.test(expression[index + 1] ?? '') &&
      (!previousToken ||
        previousToken.type === 'operator' ||
        (previousToken.type === 'paren' && previousToken.value === '('))

    if (/\d/.test(char) || canStartSignedNumber) {
      let endIndex = index + 1
      while (/[\d.]/.test(expression[endIndex] ?? '')) endIndex += 1
      const value = Number(expression.slice(index, endIndex))
      if (!Number.isFinite(value)) return []
      const token: ExpressionToken = { type: 'number', value }
      tokens.push(token)
      previousToken = token
      index = endIndex
      continue
    }

    if (/[A-Za-z_$]/.test(char)) {
      let endIndex = index + 1
      while (/[A-Za-z0-9_$]/.test(expression[endIndex] ?? '')) endIndex += 1
      const value = expression.slice(index, endIndex)
      if (!availableKeys.has(value)) return []
      const token: ExpressionToken = { type: 'identifier', value }
      tokens.push(token)
      previousToken = token
      index = endIndex
      continue
    }

    if (['+', '-', '*', '/', '%'].includes(char)) {
      const token: ExpressionToken = {
        type: 'operator',
        value: char as '+' | '-' | '*' | '/' | '%',
      }
      tokens.push(token)
      previousToken = token
      index += 1
      continue
    }

    if (char === '(' || char === ')') {
      parenthesisDepth += char === '(' ? 1 : -1
      if (parenthesisDepth < 0) return []
      const token: ExpressionToken = { type: 'paren', value: char }
      tokens.push(token)
      previousToken = token
      index += 1
      continue
    }

    return []
  }

  return parenthesisDepth === 0 ? tokens : []
}

function toReversePolish(tokens: ExpressionToken[]) {
  const output: ExpressionToken[] = []
  const operators: ExpressionToken[] = []
  const precedence = new Map([
    ['+', 1],
    ['-', 1],
    ['*', 2],
    ['/', 2],
    ['%', 2],
  ])

  for (const token of tokens) {
    if (token.type === 'number' || token.type === 'identifier') {
      output.push(token)
      continue
    }
    if (token.type === 'operator') {
      while (operators.length) {
        const top = operators.at(-1)
        if (
          !top ||
          top.type !== 'operator' ||
          (precedence.get(top.value) ?? 0) < (precedence.get(token.value) ?? 0)
        ) {
          break
        }
        output.push(operators.pop() as ExpressionToken)
      }
      operators.push(token)
      continue
    }
    if (token.value === '(') {
      operators.push(token)
      continue
    }
    while (operators.length && operators.at(-1)?.value !== '(') {
      output.push(operators.pop() as ExpressionToken)
    }
    operators.pop()
  }

  while (operators.length) {
    const token = operators.pop()
    if (token?.type === 'operator') output.push(token)
  }
  return output
}

export function evaluateExpression(expression: string, row: ReportRow) {
  const tokens = tokenizeExpression(expression, row)
  if (!tokens.length) return null

  const stack: number[] = []
  for (const token of toReversePolish(tokens)) {
    if (token.type === 'number') {
      stack.push(token.value)
      continue
    }
    if (token.type === 'identifier') {
      stack.push(toNumber(row[token.value]))
      continue
    }
    if (token.type !== 'operator') continue

    const right = stack.pop()
    const left = stack.pop()
    if (left === undefined || right === undefined) return null
    if (token.value === '+') stack.push(left + right)
    if (token.value === '-') stack.push(left - right)
    if (token.value === '*') stack.push(left * right)
    if (token.value === '/') stack.push(right === 0 ? 0 : left / right)
    if (token.value === '%') stack.push(right === 0 ? 0 : left % right)
  }

  const value = stack.length === 1 ? stack[0] : undefined
  return value === undefined || !Number.isFinite(value) ? null : value
}
