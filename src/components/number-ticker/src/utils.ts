export function toFiniteNumber(value: number | string) {
  const numericValue =
    typeof value === 'number'
      ? value
      : Number.parseFloat(value.replace(/,/g, '').trim())

  return Number.isFinite(numericValue) ? numericValue : 0
}

const formatterCache = new Map<string, Intl.NumberFormat>()
const MAX_FORMATTER_CACHE = 40

export function formatNumberTickerValue(
  value: number,
  decimals: number,
  useGrouping: boolean,
  locale?: string | string[]
) {
  const precision = Math.min(20, Math.max(0, Math.trunc(decimals)))
  const cacheKey = `${String(locale)}|${precision}|${useGrouping}`
  let formatter = formatterCache.get(cacheKey)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
      useGrouping,
    })
    if (formatterCache.size >= MAX_FORMATTER_CACHE) {
      formatterCache.clear()
    }
    formatterCache.set(cacheKey, formatter)
  }
  return formatter.format(value)
}
