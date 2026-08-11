import type { RuleObject } from 'antdv-next'

type Validator = (rule: RuleObject, value: unknown) => Promise<void> | void

const MOBILE_REG = /^1[3456789]\d{9}$/

export function validMobile(value: string) {
  return MOBILE_REG.test(value)
}

export function validateMobile(message: string): Validator {
  return async (_rule, value) => {
    if (typeof value === 'string' && value && !validMobile(value)) {
      return Promise.reject(new Error(message))
    }
    return Promise.resolve()
  }
}

export function validateCode({
  message,
  count = 6,
}: {
  message: string
  count?: number
}): Validator {
  return async (_rule, value) => {
    if (
      (typeof value !== 'string' && !Array.isArray(value)) ||
      value.length === 0
    ) {
      return Promise.reject(new Error(message))
    }
    const values = Array.isArray(value) ? value : value.split('')
    const hasEmpty = values.some(
      (item) => typeof item !== 'string' || item.trim() === ''
    )
    if (hasEmpty) {
      return Promise.reject(new Error(message))
    }
    if (value.length < count) {
      return Promise.reject(new Error(message))
    }
    return Promise.resolve()
  }
}
