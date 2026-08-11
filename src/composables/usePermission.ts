import { storeToRefs } from 'pinia'
import { hasPermission as checkPermission, permissionStore } from '@/store'

export function usePermission() {
  const store = permissionStore()
  const { permissions } = storeToRefs(store)

  // 使用 Set 优化权限查找，O(1) 复杂度
  const permissionSet = computed(() => new Set(permissions.value))

  /**
   * 校验是否拥有指定权限
   *
   * @param value 权限字符串或权限数组（数组代表只要满足其中一个即可）
   * @returns 是否拥有指定权限
   */
  const hasPermission = (value: string[] | string): boolean => {
    if (!value || (Array.isArray(value) && value.length === 0)) return false
    return checkPermission(permissionSet.value, value)
  }

  /**
   * 校验是否拥有所有指定权限
   *
   * @param values 权限数组
   * @returns 是否拥有所有指定权限
   */
  const hasEveryPermission = (values: string[]): boolean => {
    if (values.length === 0) return false
    const pSet = permissionSet.value
    return pSet.has('*') || values.every((p) => pSet.has(p))
  }

  /**
   * 追加单个权限
   *
   * @param value 权限字符串
   */
  const setPermission = (value: string) => {
    if (value) store.setPermissions([...permissions.value, value])
  }

  /**
   * 覆盖设置整组权限
   *
   * @param values 权限数组
   */
  const setPermissions = (values: string[]) => {
    store.setPermissions(values)
  }

  return {
    permissions,
    hasPermission,
    hasEveryPermission,
    setPermission,
    setPermissions,
  }
}
