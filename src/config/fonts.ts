import { FontFamily } from '../constants/config'

/**
 * 「系统默认」选项的字重
 *
 * 系统字体族的可用字重不可控,统一取中等偏粗的 500;其余选项各自声明字重,
 * 与字体栈、字距一起写入 --w-font-weight / --w-letter-spacing
 */
export const defaultFontWeight = 500

export type FontFamily = (typeof FontFamily)[keyof typeof FontFamily]

export interface FontFamilyOption {
  label: string
  value: FontFamily
  /**
   * 完整字体栈,写入 --w-font-family
   */
  stack: string
  fontWeight: number
  letterSpacing: string
}

/**
 * 中文回退字体:不自托管,直接使用系统已装字体,避免中文子集体积失控
 */
const cjkFont = 'Noto Sans SC'

const systemFontStack =
  "-apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Arial', sans-serif"

const yaheiFontStack =
  "'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', 'WenQuanYi Micro Hei', Arial, sans-serif"

/**
 * @param family 拉丁字体族
 * @param fallback 度量兜底族(定义见 src/styles/fonts.css,构建期不参与解析)
 * @returns 拉丁字体 + 度量兜底 + 中文回退 + 系统兜底的完整字体栈
 */
function createFontStack(family: string, fallback: string) {
  return `'${family}', '${fallback}', '${cjkFont}', ${systemFontStack}`
}

/**
 * 等宽字体栈(代码块、编辑器、JSON 预览等),写入 --w-font-family-mono,
 * 同时接管 UnoCSS 主题变量 --font-mono(见 unocss/presets/fonts.ts)
 *
 * 走自托管 Roboto Mono(src/assets/fonts,按需下载),其后是系统等宽兜底;
 * 刻意不接比例字体兜底:等宽场景需要稳定的字符网格,比例兜底会破坏对齐
 */
export const monoFontStack =
  "'Roboto Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace"

/**
 * 字体选项:首个字体族需与 build/plugins/fonts.ts 中的 families 声明保持一致
 */
export const fontFamilyOptions: readonly FontFamilyOption[] = [
  {
    label: 'Outfit',
    value: FontFamily.Outfit,
    stack: createFontStack('Outfit', 'Outfit Fallback'),
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Inter',
    value: FontFamily.Inter,
    stack: createFontStack('Inter Variable', 'Inter Variable Fallback'),
    fontWeight: 400,
    letterSpacing: '-0.01em',
  },
  {
    label: 'DM Sans',
    value: FontFamily.DmSans,
    stack: createFontStack('DM Sans', 'DM Sans Fallback'),
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Space Grotesk',
    value: FontFamily.SpaceGrotesk,
    stack: createFontStack('Space Grotesk', 'Space Grotesk Fallback'),
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Roboto Mono',
    value: FontFamily.RobotoMono,
    stack: createFontStack('Roboto Mono', 'Roboto Mono Fallback'),
    fontWeight: 400,
    letterSpacing: '-0.02em',
  },
  {
    label: '微软雅黑',
    value: FontFamily.MicrosoftYaHei,
    stack: yaheiFontStack,
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: '系统默认',
    value: FontFamily.System,
    stack: systemFontStack,
    fontWeight: defaultFontWeight,
    letterSpacing: '0',
  },
]
