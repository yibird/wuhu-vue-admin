import { getBaseApi } from '@/apis/util'
import type { SysNoticeCreateReq, SysNoticeUpdateReq, SysNotice } from './types'

export const {
  getPageListApi: getNoticePageListApi,
  getRecordApi: getNoticeRecordApi,
  createApi: createNoticeApi,
} = getBaseApi<SysNotice, SysNotice, SysNoticeCreateReq, SysNoticeUpdateReq>(
  '/sys/notice'
)
