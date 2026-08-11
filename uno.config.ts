import { defineConfig } from 'unocss'
import { postprocess, presets, rules, shortcuts, transformers } from './unocss'

const rgbVar = (name: string) => `rgb(var(${name}))`

export default defineConfig({
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
      primary: rgbVar('--w-color-primary'),
      success: rgbVar('--w-color-success'),
      warning: rgbVar('--w-color-warning'),
      error: rgbVar('--w-color-error'),
      info: rgbVar('--w-color-info'),
    },
  },
  presets,
  shortcuts,
  rules,
  transformers,
  postprocess,
})
