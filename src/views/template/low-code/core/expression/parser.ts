import { tokenize } from './tokenizer'
import { ExpressionError } from './types'
import type { ExpressionNode, Token } from './types'

const BINARY_PRECEDENCE: Record<string, number> = {
  '??': 1,
  '||': 2,
  '&&': 3,
  '==': 4,
  '!=': 4,
  '===': 4,
  '!==': 4,
  '<': 5,
  '<=': 5,
  '>': 5,
  '>=': 5,
  '+': 6,
  '-': 6,
  '*': 7,
  '/': 7,
  '%': 7,
}

const LOGICAL_OPERATORS = new Set(['&&', '||', '??'])
const UNARY_OPERATORS = new Set(['!', '-', '+'])
const LITERALS: Record<string, unknown> = {
  true: true,
  false: false,
  null: null,
  undefined: undefined,
}

class Parser {
  private index = 0

  constructor(private readonly tokens: Token[]) {}

  parse(): ExpressionNode {
    const node = this.parseExpression(0)
    const token = this.peek()
    if (token.type !== 'eof') {
      throw new ExpressionError(`多余的内容 "${token.value}"`, token.start)
    }
    return node
  }

  private parseExpression(minPrecedence: number): ExpressionNode {
    let left = this.parseUnary()

    while (true) {
      const token = this.peek()
      if (token.type !== 'punctuation') break
      const precedence = BINARY_PRECEDENCE[token.value]
      if (precedence === undefined || precedence < minPrecedence) break
      this.next()
      const right = this.parseExpression(precedence + 1)
      left = {
        type: LOGICAL_OPERATORS.has(token.value) ? 'Logical' : 'Binary',
        operator: token.value,
        left,
        right,
      }
    }

    // 三元表达式优先级最低
    if (minPrecedence === 0 && this.isPunctuation('?')) {
      this.next()
      const consequent = this.parseExpression(0)
      this.expect(':')
      const alternate = this.parseExpression(0)
      return {
        type: 'Conditional',
        test: left,
        consequent,
        alternate,
      }
    }

    return left
  }

  private parseUnary(): ExpressionNode {
    const token = this.peek()
    if (token.type === 'punctuation' && UNARY_OPERATORS.has(token.value)) {
      this.next()
      return {
        type: 'Unary',
        operator: token.value,
        argument: this.parseUnary(),
      }
    }
    return this.parsePostfix()
  }

  private parsePostfix(): ExpressionNode {
    let node = this.parsePrimary()

    while (true) {
      const token = this.peek()
      if (token.type !== 'punctuation') break

      if (token.value === '.') {
        this.next()
        const property = this.expectIdentifier()
        node = {
          type: 'Member',
          object: node,
          property: { type: 'Identifier', name: property.value },
          computed: false,
          optional: false,
        }
        continue
      }

      if (token.value === '?.') {
        this.next()
        if (this.isPunctuation('(')) {
          node = {
            type: 'Call',
            callee: node,
            args: this.parseArguments(),
            optional: true,
          }
          continue
        }
        if (this.isPunctuation('[')) {
          this.next()
          const property = this.parseExpression(0)
          this.expect(']')
          node = {
            type: 'Member',
            object: node,
            property,
            computed: true,
            optional: true,
          }
          continue
        }
        const property = this.expectIdentifier()
        node = {
          type: 'Member',
          object: node,
          property: { type: 'Identifier', name: property.value },
          computed: false,
          optional: true,
        }
        continue
      }

      if (token.value === '[') {
        this.next()
        const property = this.parseExpression(0)
        this.expect(']')
        node = {
          type: 'Member',
          object: node,
          property,
          computed: true,
          optional: false,
        }
        continue
      }

      if (token.value === '(') {
        node = {
          type: 'Call',
          callee: node,
          args: this.parseArguments(),
          optional: false,
        }
        continue
      }

      break
    }

    return node
  }

  private parseArguments(): ExpressionNode[] {
    this.expect('(')
    const args: ExpressionNode[] = []
    if (!this.isPunctuation(')')) {
      while (true) {
        args.push(this.parseExpression(0))
        if (this.isPunctuation(',')) {
          this.next()
          continue
        }
        break
      }
    }
    this.expect(')')
    return args
  }

  private parsePrimary(): ExpressionNode {
    const token = this.peek()

    if (token.type === 'number') {
      this.next()
      return { type: 'Literal', value: Number(token.value) }
    }

    if (token.type === 'string') {
      this.next()
      return { type: 'Literal', value: token.value }
    }

    if (token.type === 'identifier') {
      if (token.value in LITERALS) {
        this.next()
        return { type: 'Literal', value: LITERALS[token.value] }
      }
      // 箭头函数：item => item.id
      if (this.peek(1).value === '=>') {
        this.next()
        this.next()
        return {
          type: 'ArrowFunction',
          params: [token.value],
          body: this.parseExpression(0),
        }
      }
      this.next()
      return { type: 'Identifier', name: token.value }
    }

    if (token.type === 'punctuation') {
      if (token.value === '(') {
        const params = this.tryParseArrowParams()
        if (params) {
          return {
            type: 'ArrowFunction',
            params,
            body: this.parseExpression(0),
          }
        }
        this.next()
        const node = this.parseExpression(0)
        this.expect(')')
        return node
      }

      if (token.value === '[') {
        this.next()
        const elements: ExpressionNode[] = []
        if (!this.isPunctuation(']')) {
          while (true) {
            elements.push(this.parseExpression(0))
            if (this.isPunctuation(',')) {
              this.next()
              continue
            }
            break
          }
        }
        this.expect(']')
        return { type: 'Array', elements }
      }

      if (token.value === '{') {
        this.next()
        const properties: { key: string; value: ExpressionNode }[] = []
        if (!this.isPunctuation('}')) {
          while (true) {
            const keyToken = this.peek()
            if (keyToken.type !== 'identifier' && keyToken.type !== 'string') {
              throw new ExpressionError(
                '对象键必须是标识符或字符串',
                keyToken.start
              )
            }
            this.next()
            this.expect(':')
            properties.push({
              key: keyToken.value,
              value: this.parseExpression(0),
            })
            if (this.isPunctuation(',')) {
              this.next()
              continue
            }
            break
          }
        }
        this.expect('}')
        return { type: 'Object', properties }
      }
    }

    throw new ExpressionError(
      token.type === 'eof' ? '表达式不完整' : `意外的内容 "${token.value}"`,
      token.start
    )
  }

  /** 试探 `(a, b) =>` 形式的箭头函数参数 */
  private tryParseArrowParams(): string[] | undefined {
    let cursor = this.index
    // 当前必须是 '('
    if (this.tokens[cursor].value !== '(') return undefined
    cursor += 1
    const params: string[] = []

    while (this.tokens[cursor] && this.tokens[cursor].value !== ')') {
      const token = this.tokens[cursor]
      const isLast =
        this.tokens[cursor + 1] && this.tokens[cursor + 1].value === ')'
      if (token.type !== 'identifier') return undefined
      params.push(token.value)
      cursor += 1
      if (isLast) break
      if (this.tokens[cursor]?.value !== ',') return undefined
      cursor += 1
    }

    if (this.tokens[cursor]?.value !== ')') return undefined
    cursor += 1
    // 跳过空白后必须是 =>
    if (this.tokens[cursor]?.value !== '=>') return undefined
    // 消耗掉参数列表与 =>
    this.index = cursor + 1
    return params
  }

  private peek(offset = 0) {
    return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)]
  }

  private next() {
    const token = this.tokens[this.index]
    this.index += 1
    return token
  }

  private isPunctuation(value: string) {
    const token = this.peek()
    return token.type === 'punctuation' && token.value === value
  }

  private expect(value: string) {
    const token = this.peek()
    if (token.value !== value) {
      throw new ExpressionError(`缺少 "${value}"`, token.start)
    }
    return this.next()
  }

  private expectIdentifier() {
    const token = this.peek()
    if (token.type !== 'identifier') {
      throw new ExpressionError('缺少属性名', token.start)
    }
    return this.next()
  }
}

/** 解析表达式源码为 AST */
export function parseExpression(source: string): ExpressionNode {
  const trimmed = source.trim()
  if (!trimmed) {
    throw new ExpressionError('表达式不能为空', 0)
  }
  return new Parser(tokenize(trimmed)).parse()
}
