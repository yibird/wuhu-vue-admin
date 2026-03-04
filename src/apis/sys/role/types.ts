export interface RoleResp {
  /**
   * @desc 角色ID(主键唯一)
   */
  id: string
  /**
   * @desc 角色名称
   */
  roleName: string
  /**
   * @desc 数据范围(0:全部数据权限,1:本部门及以下数据权限,2:本部门数据权限,3:仅本人数据权限)
   */
  dataScope: number
}

export interface CreateRoleReq {
  roleName: string
  dataScope: number
}

export interface UpdateRoleReq {
  id: string
  roleName: string
  dataScope: number
}
