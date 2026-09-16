import { getBaseApi } from '@/apis/util'
import type {
  CreateDictItemReq,
  CreateDictReq,
  DictItemResp,
  DictResp,
  UpdateDictItemReq,
  UpdateDictReq,
} from './types'

export const {
  getPageListApi: getDictPageListApi,
  getRecordApi: getDictRecordApi,
  createApi: createDictApi,
  updateApi: updateDictApi,
  deleteApi: deleteDictApi,
} = getBaseApi<DictResp, DictResp, CreateDictReq, UpdateDictReq>('/sys/dict')

export const {
  getPageListApi: getDictItemPageListApi,
  getRecordApi: getDictItemRecordApi,
  createApi: createDictItemApi,
  updateApi: updateDictItemApi,
  deleteApi: deleteDictItemApi,
} = getBaseApi<
  DictItemResp,
  DictItemResp,
  CreateDictItemReq,
  UpdateDictItemReq
>('/sys/dict/item')
