import { getBaseApi } from '../../util'
import type { RoleResp, CreateRoleReq, UpdateRoleReq } from './types'

export const {
  getPageListApi: getRolePageListApi,
  getRecordApi: getRoleRecordApi,
} = getBaseApi<RoleResp, RoleResp, CreateRoleReq, UpdateRoleReq>('sys/role')
