export function toPx(value: string | number) {
  return typeof value === 'string' ? value : `${value}px`
}
