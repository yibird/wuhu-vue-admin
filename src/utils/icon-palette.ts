/**
 * 彩色图标底色与前景色组合
 *
 * 用于卡片左侧的图标容器,保持跨模块视觉一致。
 */
export const iconPaletteColors = [
  { background: '#DBEAFE', foreground: '#2563EB' },
  { background: '#E0E7FF', foreground: '#4F46E5' },
  { background: '#EDE9FE', foreground: '#7C3AED' },
  { background: '#FCE7F3', foreground: '#DB2777' },
  { background: '#FFEDD5', foreground: '#EA580C' },
  { background: '#DCFCE7', foreground: '#16A34A' },
  { background: '#CCFBF1', foreground: '#0D9488' },
  { background: '#FEE2E2', foreground: '#DC2626' },
] as const

const foregroundByBackground = new Map(
  iconPaletteColors.map(({ background, foreground }) => [
    background.toLowerCase(),
    foreground,
  ])
)

/**
 * 根据图标底色取对应的前景色
 *
 * @param background 图标底色
 * @returns 匹配的前景色,未知底色使用中性色
 */
export function getIconPaletteForeground(background: string) {
  return foregroundByBackground.get(background.toLowerCase()) ?? '#334155'
}

/**
 * 根据稳定标识取一组图标配色
 *
 * 同一标识始终返回同一组颜色,用于没有预设底色的动态数据。
 *
 * @param seed 稳定标识,例如记录 id
 * @returns 图标底色与前景色
 */
export function getIconPaletteColor(seed: string) {
  let hash = 0
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0
  }
  return iconPaletteColors[Math.abs(hash) % iconPaletteColors.length]
}
