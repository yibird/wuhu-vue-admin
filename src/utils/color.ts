import { colord } from 'colord'
import type { Colord } from 'colord'

export type RgbColor = readonly [red: number, green: number, blue: number]
export type ColorValue = string | RgbColor

const REG = /^(#|rgba?\(|hsla?\(|hwb\(|lab\(|lch\(|oklab\(|oklch\(|color\()/i

/**
 * 归一化颜色值
 *
 * @param value 颜色值
 * @returns 归一化后的颜色值
 */
function normalizeColor(value: string) {
  const input = value.trim()
  if (REG.test(input)) return input
  if (/^[a-z]+$/i.test(input)) return input
  return `rgb(${input})`
}

/**
 * 解析颜色值
 *
 * @param color 颜色值
 * @returns 解析后的颜色值
 */
function resolveColor(color: ColorValue): Colord | null {
  if (typeof color === 'string') {
    if (!color.trim()) return null
    const parsed = colord(normalizeColor(color))
    return parsed.isValid() ? parsed : null
  }
  const [r, g, b] = color
  return [r, g, b].every((c) => Number.isFinite(c) && c >= 0 && c <= 255)
    ? colord({ r, g, b })
    : null
}

/**
 * 将十六进制颜色值转换为 RGB 元组
 *
 * @param color 颜色值
 * @returns RGB 元组
 */
export function hexToRgb(color: string): RgbColor | null {
  const parsed = colord(color)
  if (!parsed.isValid()) return null
  const { r, g, b } = parsed.toRgb()
  return [r, g, b]
}

/**
 * 将 RGB 元组转换为十六进制颜色值
 *
 * @param color 颜色值
 * @returns 十六进制颜色值
 */
export function rgbToHex(color: ColorValue): string | null {
  return resolveColor(color)?.toHex() ?? null
}

/**
 * 将颜色转换为 RGB 字符串
 *
 * @param color 颜色值
 * @returns RGB 字符串
 */
export function toRgb(color: string): string | null {
  const parsed = resolveColor(color)
  if (!parsed) return null
  const { r, g, b } = parsed.toRgb()
  return `${r} ${g} ${b}`
}
