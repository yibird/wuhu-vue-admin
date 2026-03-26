import type { Rule } from 'unocss'

const textSizes: Record<string, object> = {
  xs: {
    'font-size': '12px',
    'line-height': '14px',
  },
  sm: {
    'font-size': '14px',
    'line-height': '18px',
  },
  base: {
    'font-size': '16px',
    'line-height': '18px',
  },
  md: {
    'font-size': '18px',
    'line-height': '32px',
  },
  '2md': {
    'font-size': '20px',
    'line-height': '34px',
  },
  lg: {
    'font-size': '24px',
    'line-height': '36px',
  },
  xl: {
    'font-size': '28px',
    'line-height': '40px',
  },
  '2xl': {
    'font-size': '36px',
    'line-height': '42px',
  },
  '3xl': {
    'font-size': '48px',
    'line-height': '56px',
  },
  '4xl': {
    'font-size': '60px',
    'line-height': '72px',
  },
  '5xl': {
    'font-size': '72px',
    'line-height': '80px',
  },
}

export const textRule: Rule = [
  /^text-([\w-]+)$/,
  ([, s]) => (s ? textSizes[s] : undefined),
]
