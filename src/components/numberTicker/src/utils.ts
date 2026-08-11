export function toFiniteNumber(value: number | string) {
  const numericValue =
    typeof value === 'number'
      ? value
      : Number.parseFloat(value.replace(/,/g, '').trim())

  return Number.isFinite(numericValue) ? numericValue : 0
}

export function formatNumberTickerValue(
  value: number,
  decimals: number,
  useGrouping: boolean,
  locale?: string | string[]
) {
  const precision = Math.min(20, Math.max(0, Math.trunc(decimals)))
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
    useGrouping,
  }).format(value)
}
