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
      cssModules: {
        // lightningcss 只支持 [name] / [local] / [hash] 三种占位符,
        // postcss-modules 风格的 [hash:base64:5] 会被判为非法并让整个 transform 抛错
        pattern: '[name]_[local]_[hash]',
      },
    },
  }
}
