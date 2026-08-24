import { usePermissionStore } from '@/store'

export function usePermission() {
  const { permissions } = usePermissionStore()

  // 使用 Set 优化权限查找,O(1) 复杂度
  const permissionSet = computed(() => new Set(permissions.value))

  /**
   * 校验是否拥有指定权限
   *
   * @param value 权限字符串或权限数组（数组代表只要满足其中一个即可）
   * @returns 是否拥有指定权限
   */
  const hasPermission = (permission: string | string[]) => {
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
    return values.every((p) => permissionSet.value.has(p))
  }

  /**
   * 追加单个权限
   *
   * @param value 权限字符串
   */
  const setPermission = (value: string) => {
    if (!permissionSet.value.has(value)) {
      permissions.value.push(value)
    }
  }

  /**
   * 删除指定权限
   *
   * @param value 权限字符串
   */
  const removePermission = (value: string) => {
    const index = permissions.value.indexOf(value)
    if (index !== -1) {
      permissions.value.splice(index, 1)
    }
  }

  /**
   * 覆盖设置整组权限
   *
   * @param values 权限数组
   */
  const setPermissions = (values: string[]) => {
    permissions.value = values
  }

  return {
    permissions,
    hasPermission,
    hasEveryPermission,
    setPermission,
    setPermissions,
    removePermission,
  }
}
