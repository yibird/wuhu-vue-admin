import type { IMenu } from '#/config'

export type PermissionRequirement = string | string[] | undefined

function normalizePermissionPath(path: string) {
  const normalized = `/${path}`.replaceAll('\\', '/').replace(/\/{2,}/g, '/')
  return normalized.length > 1 ? normalized.replace(/\/$/, '') : normalized
}

function isExternalPath(path: string) {
  return /^(?:https?:)?\/\//i.test(path)
}

export function resolveMenuPermission(
  menu: Pick<IMenu, 'path' | 'permission' | 'type'>
): PermissionRequirement {
  if (menu.permission) return menu.permission
  if (![1, 2].includes(menu.type) || !menu.path || isExternalPath(menu.path)) {
    return undefined
  }
  return normalizePermissionPath(menu.path)
}

export function hasPermission(
  permissions: ReadonlySet<string>,
  required: PermissionRequirement
) {
  if (!required) return true
  if (permissions.has('*')) return true
  const targets = Array.isArray(required) ? required : [required]
  return targets.some((permission) => permissions.has(permission))
}

export function filterMenusByPermissions(
  catalog: readonly IMenu[],
  permissions: readonly string[]
): IMenu[] {
  const permissionSet = new Set(permissions)

  return catalog.flatMap((menu) => {
    const children = menu.children
      ? filterMenusByPermissions(menu.children, permissions)
      : undefined
    const isVisible =
      menu.type === 0
        ? Boolean(children?.length)
        : hasPermission(permissionSet, resolveMenuPermission(menu))

    if (!isVisible) return []
    return [{ ...menu, children: children?.length ? children : undefined }]
  })
}
