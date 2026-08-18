/**
 * 值转换为像素
 *
 * @param value 值
 * @returns  像素值
 */
export function toPx(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`
}
