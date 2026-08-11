/**
 * 判断字符串是否为 URL（http/https 协议）
 */
export function isUrl(path?: string) {
  if (!path) return false
  return /^https?:\/\//.test(path)
}
