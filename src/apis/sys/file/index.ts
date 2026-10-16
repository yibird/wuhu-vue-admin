import { getBaseApi } from '@/apis/util'
import type { CreateFileReq, FileResp, UpdateFileReq } from './types'

export const {
  getPageListApi: getFilePageListApi,
  getRecordApi: getFileRecordApi,
  createApi: createFileApi,
  updateApi: updateFileApi,
  deleteApi: deleteFileApi,
} = getBaseApi<FileResp, FileResp, CreateFileReq, UpdateFileReq>('/sys/file')
