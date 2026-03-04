import { getBaseApi } from '@/apis/util'
import type { DeptResp, CreateDeptReq, UpdateDeptReq } from './types'

export const {
  getPageListApi: getDeptPageListApi,
  getRecordApi: getDeptRecordApi,
} = getBaseApi<DeptResp, DeptResp, CreateDeptReq, UpdateDeptReq>('/sys/dept')
