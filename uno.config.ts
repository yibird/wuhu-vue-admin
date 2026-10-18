import { defineConfig } from 'unocss'
import { postprocess, presets, rules, shortcuts, transformers } from './unocss'

const rgbVar = (name: string) => `rgb(var(${name}))`

export default defineConfig({
  blocklist: ['?'],
  /**
   * 这些图标只出现在 mock 审批流数据中，源码里没有字面量引用，
   * 需要显式加入 safelist 才会生成对应的原子类。
   */
  safelist: [
    'i-lucide:stamp',
    'i-lucide:badge-percent',
    'i-lucide:banknote',
    'i-lucide:handshake',
  ],
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
