import { getContrastColor } from '@/utils/color'

const iconColors = [
  { background: '#DBEAFE', foreground: '#2563EB' },
  { background: '#E0E7FF', foreground: '#4F46E5' },
  { background: '#EDE9FE', foreground: '#7C3AED' },
  { background: '#FCE7F3', foreground: '#DB2777' },
  { background: '#FFEDD5', foreground: '#EA580C' },
  { background: '#DCFCE7', foreground: '#16A34A' },
  { background: '#CCFBF1', foreground: '#0D9488' },
  { background: '#FEE2E2', foreground: '#DC2626' },
] as const

const iconForegroundMap = new Map(
  iconColors.map(({ background, foreground }) => [
    background.toLowerCase(),
    foreground,
  ])
)

export function getArticleIconForeground(background: string) {
  const preset = iconForegroundMap.get(background.toLowerCase())
  if (preset) return preset

  return getContrastColor(background, '#334155', '#FFFFFF') ?? 'currentColor'
}
