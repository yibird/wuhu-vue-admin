import { FONT_FAMILY, type FontFamily } from '../constants'

export interface FontOption {
  label: string
  family: FontFamily
  stack: string
  weight: string | number
  letterSpacing: string
}

const systemFontStack =
  "-apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Arial', sans-serif"

function createFontStack(family: string, fallback: string) {
  return `'${family}', '${fallback}', 'Noto Sans SC', ${systemFontStack}`
}

export const monoFontStack =
  "'Roboto Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace"

/**
 * 字体选项:首个字体族需与 build/plugins/fonts.ts 中的 families 声明保持一致
 */
export const fontOptions: FontOption[] = [
  {
    label: 'Outfit',
    family: FONT_FAMILY.Outfit,
    stack: createFontStack('Outfit', 'Outfit Fallback'),
    weight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Inter',
    family: FONT_FAMILY.Inter,
    stack: createFontStack('Inter Variable', 'Inter Variable Fallback'),
    weight: 400,
    letterSpacing: '-0.01em',
  },
  {
    label: 'DM Sans',
    family: FONT_FAMILY.DmSans,
    stack: createFontStack('DM Sans', 'DM Sans Fallback'),
    weight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Space Grotesk',
    family: FONT_FAMILY.SpaceGrotesk,
    stack: createFontStack('Space Grotesk', 'Space Grotesk Fallback'),
    weight: 400,
    letterSpacing: '0',
  },
  {
    label: 'Roboto Mono',
    family: FONT_FAMILY.RobotoMono,
    stack: createFontStack('Roboto Mono', 'Roboto Mono Fallback'),
    weight: 400,
    letterSpacing: '-0.02em',
  },
  {
    label: '微软雅黑',
    family: FONT_FAMILY.MicrosoftYaHei,
    stack:
      "'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', 'WenQuanYi Micro Hei', Arial, sans-serif",
    weight: 400,
    letterSpacing: '0',
  },
  {
    label: '系统默认',
    family: FONT_FAMILY.System,
    stack: systemFontStack,
    weight: 600,
    letterSpacing: '0',
  },
]

export function getFontFamilyOption(fontFamily: FontFamily): FontOption {
  return (
    fontOptions.find((item) => item.family === fontFamily) ?? fontOptions[0]
  )
}
