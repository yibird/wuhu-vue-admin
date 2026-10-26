import { fontOptions, monoFontStack } from '../../src/config/fonts'
import type { Preset } from 'unocss'

/**
 * 字体 CSS 变量预设
 *
 * 只负责把「字体选项」映射到 :root 与 :root[data-font] 上的 --w-font-* 变量,
 * 字体解析、自托管、度量兜底与 preload 均由 fontless 完成(见 build/plugins/fonts.ts)。
 *
 * 注意:UnoCSS 的 CSS 在 generate 阶段产出,不经过模块 transform,
 * fontless 扫描不到这里的 font-family,因此各字体族在构建配置里显式声明为 global。
 *
 * 等宽栈同时接管主题变量 --font-mono,让 font-mono 工具类与 --w-font-family-mono 同源。
 */
export const fontsPreset: Preset = {
  name: 'w-fonts',
  preflights: [
    {
      getCSS: () =>
        [
          `:root{--w-font-family:${fontOptions[0].stack};--w-font-weight:${fontOptions[0].weight};--w-letter-spacing:${fontOptions[0].letterSpacing};--w-font-family-mono:${monoFontStack}}`,
          // 惰性 CSS 分片会各自重复注入 wind4 的主题默认值(:host,:root{--font-mono:...}),
          // 这些分片后加载时会盖掉本文件的值;提高一级优先级,让结果与加载顺序无关
          ':root:root{--font-mono:var(--w-font-family-mono)}',
          ...fontOptions.map(
            (option) =>
              `:root[data-font='${option.family}']{--w-font-family:${option.stack};--w-font-weight:${option.weight};--w-letter-spacing:${option.letterSpacing}}`
          ),
        ].join('\n'),
    },
  ],
}
