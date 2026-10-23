import { getBaseApi } from '@/apis/util'
import type { SysMenuCreateReq, SysMenuUpdateReq, SysMenu } from './types'

export const {
  getPageListApi: getMenuPageListApi,
  getRecordApi: getMenuRecordApi,
} = getBaseApi<SysMenu, SysMenu, SysMenuCreateReq, SysMenuUpdateReq>(
  '/sys/menu'
)
