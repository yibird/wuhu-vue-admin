import { getBaseApi } from '@/apis/util'
import type { UserResp, CreateUserReq, UpdateUserReq } from './types'

export const {
  getPageListApi: getUserPageListApi,
  getRecordApi: getUserRecordApi,
  createApi: createUserApi,
  updateApi: updateUserApi,
  deleteApi: deleteUserApi,
} = getBaseApi<UserResp, UserResp, CreateUserReq, UpdateUserReq>('/sys/user')
