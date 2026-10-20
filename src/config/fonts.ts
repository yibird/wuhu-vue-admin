import { FONT_FAMILY, type FontFamily } from '../constants'

export interface FontFamilyOption {
  label: string
  value: FontFamily
  stack: string
  fontWeight: number
  letterSpacing: string
}

const cjkFont = 'Noto Sans SC'

const systemFontStack =
  "-apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Arial', sans-serif"

const yaheiFontStack =
  "'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', 'WenQuanYi Micro Hei', Arial, sans-serif"

function createFontStack(family: string, fallback: string) {
  return `'${family}', '${fallback}', '${cjkFont}', ${systemFontStack}`
}

export const monoFontStack =
  "'Roboto Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace"

/**
 * 字体选项:首个字体族需与 build/plugins/fonts.ts 中的 families 声明保持一致
 */
export const fontFamilyOptions: readonly FontFamilyOption[] = [
  {
    label: 'Outfit',
    value: FONT_FAMILY.Outfit,
    stack: createFontStack('Outfit', 'Outfit Fallback'),
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Inter',
    value: FONT_FAMILY.Inter,
    stack: createFontStack('Inter Variable', 'Inter Variable Fallback'),
    fontWeight: 400,
    letterSpacing: '-0.01em',
  },
  {
    label: 'DM Sans',
    value: FONT_FAMILY.DmSans,
    stack: createFontStack('DM Sans', 'DM Sans Fallback'),
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Space Grotesk',
    value: FONT_FAMILY.SpaceGrotesk,
    stack: createFontStack('Space Grotesk', 'Space Grotesk Fallback'),
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Roboto Mono',
    value: FONT_FAMILY.RobotoMono,
    stack: createFontStack('Roboto Mono', 'Roboto Mono Fallback'),
    fontWeight: 400,
    letterSpacing: '-0.02em',
  },
  {
    label: '微软雅黑',
    value: FONT_FAMILY.MicrosoftYaHei,
    stack: yaheiFontStack,
    fontWeight: 400,
    letterSpacing: '0',
  },
  {
    label: '系统默认',
    value: FONT_FAMILY.System,
    stack: systemFontStack,
    fontWeight: 600,
    letterSpacing: '0',
  },
]
