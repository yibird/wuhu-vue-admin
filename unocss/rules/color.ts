import type { Rule } from 'unocss'

const colors: Recordable = {
  theme: { color: 'rgb(var(--w-primary-color))' },
  primary: { color: '#303133' },
  regular: { color: '#606266' },
  secondary: { color: '#909399' },
  placeholder: { color: '#A8ABB2' },
  disabled: { color: '#C0C4CC' },

  // dark
  'dark-primary': { color: 'rgba(255, 255, 255, 0.85)' },
  'dark-regular': { color: 'rgba(255, 255, 255, 0.65)' },
  'dark-secondary': { color: 'rgba(255, 255, 255, 0.45)' },
  'dark-placeholder': { color: 'rgba(255, 255, 255, 0.35)' },
  'dark-disabled': { color: 'rgba(255, 255, 255, 0.25)' },
}

export const colorRule: Rule[] = [
  // 文本颜色规则
  [/^text-([\w-]+)$/, ([, s]) => ({ color: s ? colors[s]?.color : undefined })],

  // // 边框颜色规则
  // [/^border-([\w-]+)$/, ([, color]) => ({
  //   'border-color': colors[color]?.color,
  //   'border-style': 'solid',
  //   'border-width': '1px'
  // })],

  // 纯边框颜色规则（不改变边框样式和宽度）
  [
    /^border-color-([\w-]+)$/,
    ([, s]) => ({
      'border-color': s ? colors[s]?.color : undefined,
    }),
  ],
]
