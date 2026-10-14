const iconColors = [
  { background: '#E0F2FE', foreground: '#0284C7' },
  { background: '#DCFCE7', foreground: '#16A34A' },
  { background: '#FCE7F3', foreground: '#DB2777' },
  { background: '#FEF3C7', foreground: '#D97706' },
  { background: '#EDE9FE', foreground: '#7C3AED' },
  { background: '#CFFAFE', foreground: '#0891B2' },
  { background: '#E0E7FF', foreground: '#4F46E5' },
  { background: '#F1F5F9', foreground: '#475569' },
] as const

export const knowledgeBaseIconBackgroundOptions = iconColors.map(
  ({ background }) => background
)
export const defaultKnowledgeBaseIconBackground = iconColors[0].background

export function getKnowledgeBaseIconForeground(background: string) {
  const preset = iconColors.find(
    (color) => color.background.toLowerCase() === background.toLowerCase()
  )
  if (preset) return preset.foreground

  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(background)
  if (!match) return '#334155'

  const [, red = '0', green = '0', blue = '0'] = match
  const luminance =
    (0.2126 * Number.parseInt(red, 16) +
      0.7152 * Number.parseInt(green, 16) +
      0.0722 * Number.parseInt(blue, 16)) /
    255
  return luminance > 0.58 ? '#334155' : '#FFFFFF'
}
