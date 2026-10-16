import { FontFamily } from '../constants/config'

/**
 * 全局兜底字重(未命中字体选项时生效),同时作为「系统默认」选项的字重。
 * 与字体栈一起写入 --w-font-weight。
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
