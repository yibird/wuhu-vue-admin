import type { Rule } from 'unocss'

const tokens: Record<string, string> = {
  transparent: 'transparent',

  primary: 'rgb(var(--w-border-color-primary))',
  success: 'rgb(var(--w-border-color-success))',
  warning: 'rgb(var(--w-border-color-warning))',
  error: 'rgb(var(--w-border-color-error))',
  info: 'rgb(var(--w-border-color-info))',

  main: 'rgb(var(--w-border-color-main))',
  regular: 'rgb(var(--w-border-color-regular))',
  secondary: 'rgb(var(--w-border-color-secondary))',
  muted: 'rgb(var(--w-border-color-muted))',
  placeholder: 'rgb(var(--w-border-color-placeholder))',
  disabled: 'rgb(var(--w-border-color-disabled))',

  border: 'rgb(var(--w-border-color-primary))',
  'border-primary': 'rgb(var(--w-border-color-primary))',
  'border-secondary': 'rgb(var(--w-border-color-secondary))',
  'border-muted': 'rgb(var(--w-border-color-muted))',
  'border-regular': 'rgb(var(--w-border-color-regular))',
  'border-placeholder': 'rgb(var(--w-border-color-placeholder))',
  'border-disabled': 'rgb(var(--w-border-color-disabled))',

  1: 'rgb(var(--w-border-color-1))',
  2: 'rgb(var(--w-border-color-2))',
  3: 'rgb(var(--w-border-color-3))',
  4: 'rgb(var(--w-border-color-4))',
  5: 'rgb(var(--w-border-color-5))',
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const tokenKeysPattern = Object.keys(tokens)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|')

export const borderColorRule: Rule[] = [
  [
    new RegExp(`^border-color-(${tokenKeysPattern})$`),
    ([, key]) => {
      if (!key) return undefined
      const color = tokens[key]
      return color ? { 'border-color': color } : undefined
    },
  ],
]
