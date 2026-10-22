import { getBaseApi } from '@/apis/util'
import type { SysFileCreateReq, SysFile, SysFileUpdateReq } from './types'

export const {
  getPageListApi: getFilePageListApi,
  getRecordApi: getFileRecordApi,
  createApi: createFileApi,
  updateApi: updateFileApi,
  deleteApi: deleteFileApi,
} = getBaseApi<SysFile, SysFile, SysFileCreateReq, SysFileUpdateReq>(
  '/sys/file'
)
