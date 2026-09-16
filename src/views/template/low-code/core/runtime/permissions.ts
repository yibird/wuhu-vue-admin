import type { PermissionSchema } from '../schema/types'

export interface PermissionUser {
  id?: string
  name?: string
  role?: string
  roles?: string[]
  permissions?: { resource: string; actions: string[] }[]
}

export interface PermissionChecker {
  can: (resource: string, action: string) => boolean
  canAccessPage: (pageId: string) => boolean
  isRoleAllowed: (roleId: string) => boolean
}

function collectRoleIds(user: PermissionUser) {
  const roles = new Set<string>()
  if (user.role) roles.add(user.role)
  user.roles?.forEach((role) => roles.add(role))
  return roles
}

/**
 * Permission Runtime：
 * 权限模型为 User -> Role -> Permission -> Resource，权限对象是「资源 + 操作」。
 * 页面权限独立于 PageSchema 管理（PermissionSchema.pages）。
 */
export function createPermissionChecker(
  schema: PermissionSchema | undefined,
  user: PermissionUser
): PermissionChecker {
  const roleIds = collectRoleIds(user)
  const isAdmin = roleIds.has('admin')

  const directPermissions = user.permissions ?? []
  const rolePermissions =
    schema?.roles
      .filter((role) => roleIds.has(role.id))
      .flatMap((role) => role.permissions) ?? []

  const can = (resource: string, action: string) => {
    if (isAdmin) return true
    const matched = [...directPermissions, ...rolePermissions].filter(
      (permission) => permission.resource === resource
    )
    if (!matched.length) return false
    return matched.some(
      (permission) =>
        permission.actions.includes(action) || permission.actions.includes('*')
    )
  }

  const canAccessPage = (pageId: string) => {
    if (isAdmin) return true
    const allowedRoles = schema?.pages?.[pageId]
    if (!allowedRoles || allowedRoles.length === 0) return true
    return allowedRoles.some((roleId) => roleIds.has(roleId))
  }

  const isRoleAllowed = (roleId: string) => isAdmin || roleIds.has(roleId)

  return { can, canAccessPage, isRoleAllowed }
}
