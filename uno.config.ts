import { defineConfig } from 'unocss'
import { presets, shortcuts, rules, transformers, safelist } from './uno'
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|tsx)$/],
    },
  },
  theme: {
    breakpoints: {
      xxs: '0px',
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1600px',
    },
    colors: {
      primary: 'rgb(var(--w-color-primary))',
      success: 'rgb(var(--w-color-success))',
      error: 'rgb(var(--w-color-error))',
      warning: 'rgb(var(--w-color-warning))',

      // bg
      page: 'rgb(var(--w-bg-page))',
      card: 'rgb(var(--w-bg-card))',
      popover: 'rgb(var(--w-bg-popover))',

      // 文本
      main: 'rgb(var(--w-text-main))',
      regular: 'rgb(var(--w-text-regular))',
      secondary: 'rgb(var(--w-text-muted))',
      muted: 'rgb(var(--w-text-placeholder))',
      placeholder: 'rgb(var(--w-text-disabled))',

      // 高亮
      highlight: {},
    },
  },
  presets,
  shortcuts,
  rules,
  safelist,
  transformers,
  postprocess: [createRemToPxProcessor(4)],
})
