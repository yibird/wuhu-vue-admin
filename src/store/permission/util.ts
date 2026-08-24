import type { IMenu } from '#/config'

/** Return the single permission key attached to a menu route. */
export function resolveMenuPermission(
  menu: Pick<IMenu, 'permission'>
): string | undefined {
  return menu.permission
}
