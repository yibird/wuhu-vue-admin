import type { Rule } from 'unocss'

const levelBorderColors = Object.fromEntries(
  Array.from({ length: 8 }, (_, index) => {
    const level = index + 1
    return [level, `rgb(var(--w-border-color-${level}))`]
  })
)

const tokens: Record<string, string> = {
  transparent: 'transparent',

  main: 'rgb(var(--w-border-color-main))',
  regular: 'rgb(var(--w-border-color-regular))',
  secondary: 'rgb(var(--w-border-color-secondary))',
  muted: 'rgb(var(--w-border-color-muted))',
  placeholder: 'rgb(var(--w-border-color-placeholder))',
  disabled: 'rgb(var(--w-border-color-disabled))',

  ...levelBorderColors,
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const tokenKeysPattern = Object.keys(tokens)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|')

export const borderColorRule: Rule = [
  new RegExp(`^border-color-(${tokenKeysPattern})$`),
  ([, key]) => {
    if (!key) return undefined
    const color = tokens[key]
    return color
      ? {
          'border-color': color,
        }
      : undefined
  },
]
