import type { FormItemRule } from 'naive-ui'

type Validator = FormItemRule['validator']

const MOBILE_REG = /^1[3456789]\d{9}$/

export function validMobile(value: string) {
  return MOBILE_REG.test(value)
}

export function validateMobile(message: string): Validator {
  return (_rule: any, value: string) => {
    if (value && !validMobile(value)) {
      return new Error(message)
    }
  }
}

export function validateCode({
  message,
  count = 6,
}: {
  message: string
  count?: number
}): Validator {
  return (_rule: any, value: string[]) => {
    if (!value || value.length === 0) {
      return new Error(message)
    }
    const hasEmpty = value.some((item) => !item || item.trim() === '')
    if (hasEmpty) {
      return new Error(message)
    }
    if (value.length < count) {
      return new Error(message)
    }
  }
}
