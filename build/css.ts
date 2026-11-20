import type { CSSOptions } from 'vite'

export function createCss(): CSSOptions {
  return {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 110,
        edge: 110,
        firefox: 110,
        safari: 16,
      },
    },
  }
}
