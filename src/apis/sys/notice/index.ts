import { getBaseApi } from '@/apis/util'
import type { CreateNoticeReq, UpdateNoticeReq, NoticeResp } from './types'

export const {
  getPageListApi: getNoticePageListApi,
  getRecordApi: getNoticeRecordApi,
} = getBaseApi<NoticeResp, NoticeResp, CreateNoticeReq, UpdateNoticeReq>(
  '/sys/notice'
)
