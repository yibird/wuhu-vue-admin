import { getBaseApi } from '@/apis/util'
import type { CreateMenuReq, UpdateMenuReq, MenuResp } from './types'

export const {
  getPageListApi: getMenuPageListApi,
  getRecordApi: getMenuRecordApi,
} = getBaseApi<MenuResp, MenuResp, CreateMenuReq, UpdateMenuReq>('/sys/menu')
