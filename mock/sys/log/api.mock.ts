import { defineMock } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import {
  captchaLogDataSource,
  clientLogDataSource,
  findCaptchaLog,
  findClientLog,
  findLoginLog,
  findOperationLog,
  loginLogDataSource,
  operationLogDataSource,
} from './data'
import type { LogStatus } from '@/apis'
import type { BaseQuery } from '#/http'

/** 日志查询参数原样来自 URL,枚举与时间都需要归一化后再比对 */
type RawLogQuery = Record<string, unknown>
type RecordQuery = { id?: string }

function toText(value: unknown) {
  const text = String(value ?? '').trim()
  return text || undefined
}

function toStatus(value: unknown): LogStatus | undefined {
  if (value === undefined || value === '') return undefined
  return Number(value) === 1 ? 1 : 0
}

function toTimestamp(value: unknown) {
  const text = toText(value)
  if (!text) return undefined

  const timestamp = new Date(text).getTime()
  return Number.isNaN(timestamp) ? undefined : timestamp
}

function inRange(logAt: string, query: RawLogQuery) {
  const startTime = toTimestamp(query.startTime)
  const endTime = toTimestamp(query.endTime)
  if (startTime === undefined && endTime === undefined) return true

  const timestamp = new Date(logAt).getTime()
  if (startTime !== undefined && timestamp < startTime) return false
  if (endTime !== undefined && timestamp > endTime) return false
  return true
}

function toPageQuery(query: RawLogQuery): BaseQuery {
  return {
    current: Number(query.current) || 1,
    pageSize: Number(query.pageSize) || 10,
  }
}

function matches(text: string, keyword: unknown) {
  const value = toText(keyword)?.toLowerCase()
  return !value || text.toLowerCase().includes(value)
}

function filterLoginLogs(query: RawLogQuery) {
  const status = toStatus(query.status)

  return loginLogDataSource.filter(
    (item) =>
      matches(item.username, query.username) &&
      matches(item.ip, query.ip) &&
      (status === undefined || item.status === status) &&
      inRange(item.logAt, query)
  )
}

function filterOperationLogs(query: RawLogQuery) {
  const status = toStatus(query.status)
  const method = toText(query.method)

  return operationLogDataSource.filter(
    (item) =>
      matches(item.username, query.username) &&
      matches(item.message, query.message) &&
      (!method || item.method === method) &&
      (status === undefined || item.status === status) &&
      inRange(item.logAt, query)
  )
}

function filterClientLogs(query: RawLogQuery) {
  const level = toText(query.level)

  return clientLogDataSource.filter(
    (item) =>
      matches(item.message, query.message) &&
      matches(item.source, query.source) &&
      (!level || item.level === level) &&
      inRange(item.logAt, query)
  )
}

function filterCaptchaLogs(query: RawLogQuery) {
  const status = toStatus(query.status)
  const type = toText(query.type)
  const scene = toText(query.scene)

  return captchaLogDataSource.filter(
    (item) =>
      (!type || item.type === type) &&
      (!scene || item.scene === scene) &&
      (status === undefined || item.status === status) &&
      inRange(item.logAt, query)
  )
}

export default defineMock([
  {
    url: '/api/sys/log/login/getPageList',
    method: 'GET',
    body: ({ query }: { query: RawLogQuery }) =>
      apiOk(getPageList(filterLoginLogs(query), toPageQuery(query))),
  },
  {
    url: '/api/sys/log/login/getRecord',
    method: 'GET',
    body: ({ query }: { query: RecordQuery }) => {
      const detail = query.id ? findLoginLog(query.id) : undefined
      return detail ? apiOk(detail) : apiErr('日志不存在')
    },
  },
  {
    url: '/api/sys/log/operation/getPageList',
    method: 'GET',
    body: ({ query }: { query: RawLogQuery }) =>
      apiOk(getPageList(filterOperationLogs(query), toPageQuery(query))),
  },
  {
    url: '/api/sys/log/operation/getRecord',
    method: 'GET',
    body: ({ query }: { query: RecordQuery }) => {
      const detail = query.id ? findOperationLog(query.id) : undefined
      return detail ? apiOk(detail) : apiErr('日志不存在')
    },
  },
  {
    url: '/api/sys/log/client/getPageList',
    method: 'GET',
    body: ({ query }: { query: RawLogQuery }) =>
      apiOk(getPageList(filterClientLogs(query), toPageQuery(query))),
  },
  {
    url: '/api/sys/log/client/getRecord',
    method: 'GET',
    body: ({ query }: { query: RecordQuery }) => {
      const detail = query.id ? findClientLog(query.id) : undefined
      return detail ? apiOk(detail) : apiErr('日志不存在')
    },
  },
  {
    url: '/api/sys/log/captcha/getPageList',
    method: 'GET',
    body: ({ query }: { query: RawLogQuery }) =>
      apiOk(getPageList(filterCaptchaLogs(query), toPageQuery(query))),
  },
  {
    url: '/api/sys/log/captcha/getRecord',
    method: 'GET',
    body: ({ query }: { query: RecordQuery }) => {
      const detail = query.id ? findCaptchaLog(query.id) : undefined
      return detail ? apiOk(detail) : apiErr('日志不存在')
    },
  },
])
