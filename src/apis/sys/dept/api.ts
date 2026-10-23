import { getBaseApi } from '@/apis/util'
import type { SysDept, SysDeptCreateReq, SysDeptUpdateReq } from './types'

export const {
  getPageListApi: getDeptPageListApi,
  getRecordApi: getDeptRecordApi,
  createApi: createDeptApi,
  updateApi: updateDeptApi,
  deleteApi: deleteDeptApi,
} = getBaseApi<SysDept, SysDept, SysDeptCreateReq, SysDeptUpdateReq>(
  '/sys/dept'
)
