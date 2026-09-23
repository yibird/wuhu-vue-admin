import { formatRgbColor } from '../utils/color.ts'

interface LoadingThemeOptions {
  themeColor?: string
  themeMode?: string
}

function normalizeThemeColor(themeColor?: string) {
  return formatRgbColor(themeColor ?? '', ' ') ?? '24 144 255'
}

export function applyAppLoadingTheme({
  themeColor,
  themeMode,
}: LoadingThemeOptions) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const primaryColor = normalizeThemeColor(themeColor)
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  root.style.setProperty('--app-loading-primary-rgb', primaryColor)
  root.style.setProperty('--w-color-primary', primaryColor)
  root.dataset.theme = isDark ? 'dark' : 'light'
  root.style.colorScheme = isDark ? 'dark' : 'light'
}

export function hideAppLoading() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const loadingEl = document.getElementById('app-loading')
      const loadingStyleEl = document.getElementById('app-loading-style')
      if (!loadingEl) return
      loadingEl.classList.add('app-loading--hidden')
      window.setTimeout(() => {
        loadingEl.remove()
        loadingStyleEl?.remove()
      }, 320)
    })
  })
}
