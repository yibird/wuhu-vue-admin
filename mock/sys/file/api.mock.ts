import { defineMock } from 'vite-plugin-mock-dev-server'
import type { SysFileCreateReq, FileKind, SysFileUpdateReq } from '@/apis'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import {
  appendFile,
  deleteFiles,
  fileDataSource,
  findFile,
  updateFile,
} from './data'

function toTimestamp(value: unknown) {
  if (typeof value !== 'string' || !value) return undefined
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? undefined : timestamp
}

export default defineMock([
  {
    url: '/api/sys/file/getPageList',
    method: 'GET',
    body: ({ query }: { query: Record<string, unknown> }) => {
      const name = String(query.name ?? '')
        .trim()
        .toLowerCase()
      const kind = query.kind ? (String(query.kind) as FileKind) : undefined
      const startTime = toTimestamp(query.startTime)
      const endTime = toTimestamp(query.endTime)
      const filtered = fileDataSource.filter((item) => {
        if (name && !item.name.toLowerCase().includes(name)) return false
        if (kind && item.kind !== kind) return false
        const createdAt = new Date(item.createdAt).getTime()
        if (startTime !== undefined && createdAt < startTime) return false
        if (endTime !== undefined && createdAt > endTime) return false
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
    url: '/api/sys/file/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const file = query.id ? findFile(query.id) : undefined
      return file ? apiOk(file) : apiErr('文件不存在')
    },
  },
  {
    url: '/api/sys/file/create',
    method: 'POST',
    body: ({ body }: { body: SysFileCreateReq }) => apiOk(appendFile(body).id),
  },
  {
    url: '/api/sys/file/update',
    method: 'POST',
    body: ({ body }: { body: SysFileUpdateReq }) =>
      updateFile(body) ? apiOk(1) : apiErr('文件不存在'),
  },
  {
    url: '/api/sys/file/del',
    method: 'POST',
    body: ({ body }: { body: Array<string | number> }) =>
      deleteFiles(body) ? apiOk(1) : apiErr('文件不存在'),
  },
])
