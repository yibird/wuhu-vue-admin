import type { Rule } from 'unocss'

const tokens: Record<string, string> = {
  // text colors
  main: 'rgb(var(--w-text-main))',
  regular: 'rgb(var(--w-text-regular))',
  secondary: 'rgb(var(--w-text-secondary))',
  muted: 'rgb(var(--w-text-muted))',
  placeholder: 'rgb(var(--w-text-placeholder))',
  disabled: 'rgb(var(--w-text-disabled))',
  link: 'rgb(var(--w-text-link))',
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const tokenKeysPattern = Object.keys(tokens)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|')

export const colorRule: Rule = [
  new RegExp(`^text-(${tokenKeysPattern})$`),
  ([, key]) => {
    const color = tokens[key]
    return color ? { color } : undefined
  },
]
