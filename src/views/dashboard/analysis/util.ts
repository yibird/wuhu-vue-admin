/**
 * 金额与数量格式化
 *
 * 格式化器创建一次复用,避免在组件渲染里重复 new Intl.NumberFormat。
 */
const currencyFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 0,
  style: 'currency',
})

const compactCurrencyFormatter = new Intl.NumberFormat('zh-CN', {
  currency: 'CNY',
  maximumFractionDigits: 1,
  notation: 'compact',
  style: 'currency',
})

const countFormatter = new Intl.NumberFormat('zh-CN')

/**
 * 完整金额,用于目标值等需要精确展示的场合
 *
 * @param value 金额
 */
export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

/**
 * 紧凑金额,用于卡片内的次要数值
 *
 * @param value 金额
 */
export function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value)
}

/**
 * 整数计数
 *
 * @param value 数量
 */
export function formatCount(value: number) {
  return countFormatter.format(value)
}
