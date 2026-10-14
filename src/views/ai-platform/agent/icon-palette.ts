const iconColors = [
  { background: '#DBEAFE', foreground: '#2563EB' },
  { background: '#E0E7FF', foreground: '#4F46E5' },
  { background: '#EDE9FE', foreground: '#7C3AED' },
  { background: '#FCE7F3', foreground: '#DB2777' },
  { background: '#FFEDD5', foreground: '#EA580C' },
  { background: '#DCFCE7', foreground: '#16A34A' },
  { background: '#CCFBF1', foreground: '#0D9488' },
  { background: '#CFFAFE', foreground: '#0891B2' },
] as const

export const agentIconBackgroundOptions = iconColors.map(
  ({ background }) => background
)
export const defaultAgentIconBackground = iconColors[0].background

export function getAgentIconForeground(background: string) {
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
