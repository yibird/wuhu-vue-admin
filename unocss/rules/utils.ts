/**
 * 转义字符串中的正则特殊字符
 * @param value 待转义字符串
 * @returns 可直接拼入正则表达式的字符串
 */
export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 由 token 键生成正则分支,按长度降序避免短键优先匹配
 * @param tokens token 映射
 * @returns 可直接放入正则分组的分支字符串
 */
export function createTokenPattern(tokens: Record<string, string>) {
  return Object.keys(tokens)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')
}
