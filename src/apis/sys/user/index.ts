import { getBaseApi } from '@/apis/util'
import type { UserResp, CreateUserReq, UpdateUserReq } from './types'

export const {
  getPageListApi: getUserPageListApi,
  getRecordApi: getUserRecordApi,
} = getBaseApi<UserResp, UserResp, CreateUserReq, UpdateUserReq>('/sys/user')
