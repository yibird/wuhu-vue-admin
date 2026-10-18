/**
 * 生成带前缀的唯一 id
 * @param prefix 前缀
 * @returns id
 */
export function createId(prefix: string) {
  const random =
    globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
  return `${prefix}-${random}`
}
