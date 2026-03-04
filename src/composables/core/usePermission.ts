import { intersection } from 'es-toolkit'

export function usePermission() {
  const permissions: string[] = []
  const hasPermission = (value: string[] | string) => {
    const values = Array.from(value)
    return intersection(permissions, values)
  }
  const setPermission = (value: string) => {}
  const setPermissions = (values: string[]) => {}

  return {
    permissions,
    hasPermission,
    setPermission,
    setPermissions,
  }
}
