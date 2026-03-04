import { getBaseApi } from '@/apis/util'
import type { CreateDictReq, UpdateDictReq, DictResp } from './types'

export const {
  getPageListApi: getDictPageListApi,
  getRecordApi: getDictRecordApi,
} = getBaseApi<DictResp, DictResp, CreateDictReq, UpdateDictReq>('/sys/dict')
