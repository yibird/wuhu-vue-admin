/**
 * 标准化路由路径
 *
 * @param path - 原始路径字符串
 * @returns 标准化后的路径（以 / 开头，去除多余斜杠）
 * @example
 * normalizeRoutePath('/user/list')  // '/user/list'
 * normalizeRoutePath('user/list/')  // '/user/list'
 * normalizeRoutePath('')            // '/'
 */
export function normalizePath(path: string): string {
  const normalized = path.trim().replace(/^\/+|\/+$/g, '')
  return normalized ? `/${normalized}` : '/'
}

/**
 * 转换为子路由路径（去除前缀 /）
 * @param path - 原始路径字符串
 * @returns 子路由路径（无前缀 /）
 * @example
 * toChildRoutePath('/user/list')  // 'user/list'
 */
export function toChildRoutePath(path: string): string {
  return normalizePath(path).replace(/^\//, '')
}

/**
 * 转换为 PascalCase 名称
 * @param value - 原始字符串（支持 / 和 - 分隔符）
 * @returns PascalCase 格式的组件名称
 * @example
 * toPascalCase('/user/list')      // 'UserList'
 * toPascalCase('user-detail')     // 'UserDetail'
 */
export function toPascalCase(value: string): string {
  return value
    .split(/[/-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
