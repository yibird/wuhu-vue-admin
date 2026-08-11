export function getCssRgbVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()

  return value ? `rgb(${value})` : fallback
}

export function getCssRgbVarAlpha(
  name: string,
  alpha: number,
  fallback: string
) {
  if (typeof window === 'undefined') return fallback

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()

  return value ? `rgb(${value} / ${alpha})` : fallback
}
