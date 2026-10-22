/**
 * 解析数字,如果解析失败则返回默认值
 *
 * @param value 待解析的值
 * @param fallback 解析失败时的默认值
 * @returns 解析后的数字
 */
export function parseNumber(value: unknown, fallback: number) {
  if (value === undefined || value === null || value === '') return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
