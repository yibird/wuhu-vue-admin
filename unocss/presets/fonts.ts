import { fontFamilyOptions } from '../../src/config/fonts'
import type { Preset } from 'unocss'

/**
 * 字体 CSS 变量预设
 *
 * 只负责把「字体选项」映射到 :root 与 :root[data-font] 上的 --w-font-* 变量,
 * 字体解析、自托管、度量兜底与 preload 均由 fontless 完成(见 build/plugins/fonts.ts)。
 *
 * 注意:UnoCSS 的 CSS 在 generate 阶段产出,不经过模块 transform,
 * fontless 扫描不到这里的 font-family,因此各字体族在构建配置里显式声明为 global。
 */
export const fontsPreset: Preset = {
  name: 'w-fonts',
  preflights: [
    {
      getCSS: () =>
        [
          `:root{--w-font-family:${fontFamilyOptions[0].stack};--w-font-weight:${fontFamilyOptions[0].fontWeight};--w-letter-spacing:${fontFamilyOptions[0].letterSpacing}}`,
          ...fontFamilyOptions.map(
            (option) =>
              `:root[data-font='${option.value}']{--w-font-family:${option.stack};--w-font-weight:${option.fontWeight};--w-letter-spacing:${option.letterSpacing}}`
          ),
        ].join('\n'),
    },
  ],
}
