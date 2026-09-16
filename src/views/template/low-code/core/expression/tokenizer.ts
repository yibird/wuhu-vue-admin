import { ExpressionError } from './types'
import type { Token } from './types'

const PUNCTUATIONS = [
  '?.',
  '===',
  '!==',
  '==',
  '!=',
  '<=',
  '>=',
  '&&',
  '||',
  '??',
  '=>',
  '+',
  '-',
  '*',
  '/',
  '%',
  '!',
  '?',
  ':',
  '.',
  ',',
  '(',
  ')',
  '[',
  ']',
  '{',
  '}',
  '<',
  '>',
]

const IDENTIFIER_START = /[A-Za-z_$]/
const IDENTIFIER_PART = /[\w$]/
const NUMBER_PATTERN = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/

/** 将表达式源码解析为 Token 序列（词法分析） */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < source.length) {
    const char = source[index]

    if (/\s/.test(char)) {
      index += 1
      continue
    }

    // 字符串字面量
    if (char === '"' || char === "'" || char === '`') {
      const quote = char
      let cursor = index + 1
      let value = ''
      while (cursor < source.length) {
        const current = source[cursor]
        if (current === '\\') {
          const next = source[cursor + 1]
          value += unescape(next)
          cursor += 2
          continue
        }
        if (current === quote) break
        value += current
        cursor += 1
      }
      if (cursor >= source.length) {
        throw new ExpressionError(`未闭合的字符串: ${quote}`, index)
      }
      tokens.push({
        type: 'string',
        value,
        start: index,
        end: cursor + 1,
      })
      index = cursor + 1
      continue
    }

    // 数字字面量
    if (/\d/.test(char) || (char === '.' && /\d/.test(source[index + 1]))) {
      const match = NUMBER_PATTERN.exec(source.slice(index))
      if (match) {
        tokens.push({
          type: 'number',
          value: match[0],
          start: index,
          end: index + match[0].length,
        })
        index += match[0].length
        continue
      }
    }

    // 标识符 / 关键字
    if (IDENTIFIER_START.test(char)) {
      let cursor = index + 1
      while (cursor < source.length && IDENTIFIER_PART.test(source[cursor])) {
        cursor += 1
      }
      tokens.push({
        type: 'identifier',
        value: source.slice(index, cursor),
        start: index,
        end: cursor,
      })
      index = cursor
      continue
    }

    // 运算符 / 标点
    const punctuation = PUNCTUATIONS.find((item) =>
      source.startsWith(item, index)
    )
    if (!punctuation) {
      throw new ExpressionError(`无法识别的字符 "${char}"`, index)
    }
    tokens.push({
      type: 'punctuation',
      value: punctuation,
      start: index,
      end: index + punctuation.length,
    })
    index += punctuation.length
  }

  tokens.push({ type: 'eof', value: '', start: index, end: index })
  return tokens
}

function unescape(char: string | undefined) {
  if (char === undefined) return ''
  const map: Record<string, string> = {
    n: '\n',
    r: '\r',
    t: '\t',
    b: '\b',
    f: '\f',
    v: '\v',
    '0': '\0',
  }
  return map[char] ?? char
}
