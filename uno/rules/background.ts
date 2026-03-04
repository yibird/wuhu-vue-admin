import type { Rule } from 'unocss'

const bgColors: Recordable = {
  theme: { 'background-color': 'var(--w-primary-color)' },
  'theme-secondary': {
    'background-color': `color-mix(in srgb, var(--ant-color-primary) 30%, transparent)`,
  },
  'theme-regular': {
    'background-color': `color-mix(in srgb, var(--ant-color-primary) 20%, transparent)`,
  },
  'theme-placeholder': {
    'background-color': `color-mix(in srgb, var(--ant-color-primary) 10%, transparent)`,
  },
  primary: { 'background-color': '#303133' },
  // dark
  'dark-primary': { 'background-color': '#1c1e23' },
  'dark-regular': { 'background-color': '#262626' },
  'dark-secondary': { 'background-color': 'rgba(255, 255, 255, 0.45)' },
  'dark-placeholder': { 'background-color': 'rgba(255, 255, 255, 0.35)' },
  'dark-disabled': { 'background-color': 'rgba(255, 255, 255, 0.25)' },
}
export const bgRule: Rule = [
  /^bg-([\w-]+)$/,
  ([, s]) => (s ? bgColors[s] : undefined),
]
