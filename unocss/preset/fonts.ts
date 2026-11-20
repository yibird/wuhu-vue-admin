import { fontOptions, monoFontStack } from '../../src/config/fonts'
import type { Preset } from 'unocss'

/**
 * 字体 CSS 变量预设
 */
export const fontsPreset: Preset = {
  name: 'w-fonts',
  preflights: [
    {
      getCSS: () =>
        [
          `:root{--w-font-family:${fontOptions[0].stack};--w-font-weight:${fontOptions[0].weight};--w-letter-spacing:${fontOptions[0].letterSpacing};--w-font-family-mono:${monoFontStack}}`,
          ':root:root{--font-mono:var(--w-font-family-mono)}',
          ...fontOptions.map(
            (option) =>
              `:root[data-font='${option.family}']{--w-font-family:${option.stack};--w-font-weight:${option.weight};--w-letter-spacing:${option.letterSpacing}}`
          ),
        ].join('\n'),
    },
  ],
}
