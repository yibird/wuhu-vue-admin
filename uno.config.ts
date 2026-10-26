import { defineConfig } from 'unocss'
import { postprocess, presets, rules, shortcuts, transformers } from './unocss'

export default defineConfig({
  blocklist: ['?'],
  safelist: [],
  content: {
    pipeline: {
      include: ['src/**/*.{vue,ts,tsx}'],
    },
  },
  theme: {
    colorMix: false,
    breakpoint: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      primary: 'rgba(var(--w-color-primary))',
      success: 'rgba(var(--w-color-success))',
      warning: 'rgba(var(--w-color-warning))',
      error: 'rgba(var(--w-color-error))',
      info: 'rgba(var(--w-color-info))',
    },
  },
  presets,
  shortcuts,
  rules,
  transformers,
  postprocess,
})
