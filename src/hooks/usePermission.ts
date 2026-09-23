import { usePermissionStore } from '@/store'

export const PERMISSION_ALL = '*'

export function usePermission() {
  const { permissions } = usePermissionStore()

  // 使用 Set 优化权限查找,O(1) 复杂度
  const permissionSet = computed(() => new Set(permissions.value))
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
