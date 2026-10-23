import { getBaseApi } from '@/apis/util'
import type {
  SysDictDataCreateReq,
  SysDictTypeCreateReq,
  SysDictData,
  SysDictType,
  SysDictDataUpdateReq,
  SysDictTypeUpdateReq,
} from './types'

export const {
  getPageListApi: getDictPageListApi,
  getRecordApi: getDictRecordApi,
  createApi: createDictApi,
  updateApi: updateDictApi,
  deleteApi: deleteDictApi,
} = getBaseApi<
  SysDictType,
  SysDictType,
  SysDictTypeCreateReq,
  SysDictTypeUpdateReq
>('/sys/dict')

export const {
  getPageListApi: getDictItemPageListApi,
  getRecordApi: getDictItemRecordApi,
  createApi: createDictItemApi,
  updateApi: updateDictItemApi,
  deleteApi: deleteDictItemApi,
} = getBaseApi<
  SysDictData,
  SysDictData,
  SysDictDataCreateReq,
  SysDictDataUpdateReq
>('/sys/dict/item')
