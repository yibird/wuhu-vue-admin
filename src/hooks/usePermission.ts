import { usePermissionStore } from '@/store'

export const PERMISSION_ALL = '*'

/**
 * 权限数组到 Set 的缓存
 *
 * 权限列表 getter 在依赖不变时返回同一数组引用,
 * 以数组引用为键缓存 Set,避免指令 updated 等高频路径重复构建。
 */
const permissionSetCache = new WeakMap<readonly string[], ReadonlySet<string>>()

function toPermissionSet(permissions: readonly string[]) {
  const cached = permissionSetCache.get(permissions)
  if (cached) return cached

  const set = new Set(permissions)
  permissionSetCache.set(permissions, set)
  return set
}

/**
 * 直接校验权限,不创建 computed
 *
 * 供指令等非组件 setup 环境的高频调用使用。
 * @param value 权限字符串或权限数组(数组代表满足其一即可)
 * @returns 是否拥有权限
 */
export function hasPermissionValue(value: string | string[]) {
  const { permissions } = usePermissionStore()
  const permissionSet = toPermissionSet(permissions.value)
  if (permissionSet.has(PERMISSION_ALL)) return true
  return Array.isArray(value)
    ? value.some((item) => permissionSet.has(item))
    : permissionSet.has(value)
}

export function usePermission() {
  const { permissions } = usePermissionStore()

  // 使用 Set 优化权限查找,O(1) 复杂度;同一权限数组复用缓存
  const permissionSet = computed(() => toPermissionSet(permissions.value))
  const hasAllPermission = computed(() =>
    permissionSet.value.has(PERMISSION_ALL)
  )

  /**
   * 校验是否拥有指定权限
   *
   * @param value 权限字符串或权限数组（数组代表只要满足其中一个即可）
   * @returns 是否拥有指定权限
   */
  const hasPermission = (permission: string | string[]) => {
    if (hasAllPermission.value) return true
    return Array.isArray(permission)
      ? permission.some((item) => permissionSet.value.has(item))
      : permissionSet.value.has(permission)
  }

  /**
   * 校验是否拥有所有指定权限
   *
   * @param values 权限数组
   * @returns 是否拥有所有指定权限
   */
  const hasEveryPermission = (values: string[]): boolean => {
    if (values.length === 0) return false
    if (hasAllPermission.value) return true
    return values.every((p) => permissionSet.value.has(p))
  }

  return {
    permissions,
    hasPermission,
    hasEveryPermission,
  }
}
