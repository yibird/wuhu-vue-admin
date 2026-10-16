import type { IMenu } from '#/config'

export interface PermissionState {
  /**
   * @desc 菜单列表
   */
  menus: IMenu[]
  /**
   * @desc 后端下发的权限码,'*' 表示拥有全部权限
   */
  sessionPermissions: string[]
}
