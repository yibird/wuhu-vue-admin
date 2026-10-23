import { getBaseApi } from '../../util'
import type { SysRole, SysRoleCreateReq, SysRoleUpdateReq } from './types'

export const {
  getPageListApi: getRolePageListApi,
  getRecordApi: getRoleRecordApi,
  createApi: createRoleApi,
  updateApi: updateRoleApi,
  deleteApi: deleteRoleApi,
} = getBaseApi<SysRole, SysRole, SysRoleCreateReq, SysRoleUpdateReq>(
  '/sys/role'
)
