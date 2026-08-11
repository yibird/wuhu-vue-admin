import type { Rule } from 'unocss'

const themeColors = ['primary', 'success', 'warning', 'error', 'info']
const statusColors = ['hover', 'active', 'selected', 'disabled', 'fill', 'mask']

const generateColors = (colors: string[], count: number) => {
  return colors.reduce(
    (acc, key) => {
      acc[key] = `rgb(var(--w-bg-${key}))`
      for (let i = 1; i <= count; i++) {
        acc[`${key}-${i}`] = `rgb(var(--w-bg-${key}-${i}))`
      }
      return acc
    },
    {} as Record<string, string>
  )
}

const tokens: Record<string, string> = {
  page: 'rgb(var(--w-bg-page))',
  base: 'rgb(var(--w-bg-base))',
  main: 'rgb(var(--w-bg-main))',
  surface: 'rgb(var(--w-bg-main))',
  elevated: 'rgb(var(--w-bg-elevated))',
  popover: 'rgb(var(--w-bg-elevated))',
  container: 'rgb(var(--w-bg-container))',
  'container-secondary': 'rgb(var(--w-bg-container-secondary))',
  secondary: 'rgb(var(--w-bg-secondary))',

  'fill-secondary': 'rgb(var(--w-fill-secondary))',
  'fill-tertiary': 'rgb(var(--w-fill-tertiary))',
  'fill-quaternary': 'rgb(var(--w-fill-quaternary))',

  ...generateColors(themeColors, 3),
  ...generateColors(statusColors, 8),

  'primary-tint': 'var(--w-bg-primary-tint)',
  'primary-tint-hover': 'var(--w-bg-primary-tint-hover)',
  'success-tint': 'rgb(var(--w-bg-success-tint))',
  'success-tint-hover': 'rgb(var(--w-bg-success-tint-hover))',
  'warning-tint': 'rgb(var(--w-bg-warning-tint))',
  'warning-tint-hover': 'rgb(var(--w-bg-warning-tint-hover))',
  'error-tint': 'rgb(var(--w-bg-error-tint))',
  'error-tint-hover': 'rgb(var(--w-bg-error-tint-hover))',
  'info-tint': 'rgb(var(--w-bg-info-tint))',
  'info-tint-hover': 'rgb(var(--w-bg-info-tint-hover))',
}

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const tokenKeysPattern = Object.keys(tokens)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|')

export const bgRule: Rule[] = [
  [
    new RegExp(`^bg-(${tokenKeysPattern})$`),
    ([, key]) => {
      if (!key) return undefined
      const color = tokens[key]
      return color ? { 'background-color': color } : undefined
    },
  ],
]
