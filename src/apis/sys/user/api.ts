import { getBaseApi } from '@/apis/util'
import type { SysUser, SysUserCreateReq, SysUserUpdateReq } from './types'

export const {
  getPageListApi: getUserPageListApi,
  getRecordApi: getUserRecordApi,
  createApi: createUserApi,
  updateApi: updateUserApi,
  deleteApi: deleteUserApi,
} = getBaseApi<SysUser, SysUser, SysUserCreateReq, SysUserUpdateReq>(
  '/sys/user'
)
