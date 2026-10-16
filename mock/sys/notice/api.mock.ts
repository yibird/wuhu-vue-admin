import { defineMock } from 'vite-plugin-mock-dev-server'
import type { CreateNoticeReq } from '@/apis'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import { appendNotice, findNotice, noticeDataSource } from './data'

function parseBoolean(value: unknown) {
  if (value === undefined) return undefined
  return value === true || value === 'true' || value === 1 || value === '1'
}

export default defineMock([
  {
    url: '/api/sys/notice/getPageList',
    method: 'GET',
    body: ({ query }: { query: Record<string, unknown> }) => {
      const title = String(query.title ?? '')
        .trim()
        .toLowerCase()
      const type = query.type === undefined ? undefined : Number(query.type)
      const status = parseBoolean(query.status)
      const filtered = noticeDataSource.filter((item) => {
        if (title && !item.title.toLowerCase().includes(title)) return false
        if (type !== undefined && item.type !== type) return false
        if (status !== undefined && item.status !== status) return false
        return true
      })
      return apiOk(
        getPageList(filtered, {
          current: Number(query.current) || 1,
          pageSize: Number(query.pageSize) || 10,
        })
      )
    },
  },
  {
    url: '/api/sys/notice/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const notice = query.id ? findNotice(query.id) : undefined
      return notice ? apiOk(notice) : apiErr('通知不存在')
    },
  },
  {
    url: '/api/sys/notice/create',
    method: 'POST',
    body: ({ body }: { body: CreateNoticeReq }) => apiOk(appendNotice(body).id),
  },
])
