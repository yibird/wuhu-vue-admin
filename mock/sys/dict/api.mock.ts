import { defineMock } from 'vite-plugin-mock-dev-server'
import type {
  CreateDictItemReq,
  CreateDictReq,
  UpdateDictItemReq,
  UpdateDictReq,
} from '@/apis'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import {
  appendDict,
  appendDictItem,
  deleteDict,
  deleteDictItems,
  dictDataSource,
  dictItemDataSource,
  findDict,
  findDictItem,
  updateDict,
  updateDictItem,
} from './data'

function parseBoolean(value: unknown) {
  if (value === undefined) return undefined
  return value === true || value === 'true' || value === 1 || value === '1'
}

export default defineMock([
  {
    url: '/api/sys/dict/getPageList',
    method: 'GET',
    body: ({ query }: { query: Record<string, unknown> }) => {
      const name = String(query.name ?? '')
        .trim()
        .toLowerCase()
      const type = String(query.type ?? '')
        .trim()
        .toLowerCase()
      const status = parseBoolean(query.status)
      const filtered = dictDataSource.filter((item) => {
        if (name && !item.name.toLowerCase().includes(name)) return false
        if (type && !item.type.toLowerCase().includes(type)) return false
        if (status !== undefined && item.status !== status) return false
        return true
      })
      return apiOk(
        getPageList(filtered, {
          pageNum: Number(query.pageNum) || 1,
          pageSize: Number(query.pageSize) || 10,
        })
      )
    },
  },
  {
    url: '/api/sys/dict/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const dict = query.id ? findDict(query.id) : undefined
      return dict ? apiOk(dict) : apiErr('字典不存在')
    },
  },
  {
    url: '/api/sys/dict/create',
    method: 'POST',
    body: ({ body }: { body: CreateDictReq }) => apiOk(appendDict(body).id),
  },
  {
    url: '/api/sys/dict/update',
    method: 'POST',
    body: ({ body }: { body: UpdateDictReq }) =>
      updateDict(body) ? apiOk(1) : apiErr('字典不存在'),
  },
  {
    url: '/api/sys/dict/del',
    method: 'POST',
    body: ({ body }: { body: Array<string | number> }) =>
      deleteDict(body) ? apiOk(1) : apiErr('字典不存在'),
  },
  {
    url: '/api/sys/dict/item/getPageList',
    method: 'GET',
    body: ({ query }: { query: Record<string, unknown> }) => {
      const dictId = String(query.dictId ?? '')
      const label = String(query.label ?? '')
        .trim()
        .toLowerCase()
      const value = String(query.value ?? '')
        .trim()
        .toLowerCase()
      const status = parseBoolean(query.status)
      const filtered = dictItemDataSource.filter((item) => {
        if (dictId && item.dictId !== dictId) return false
        if (label && !item.label.toLowerCase().includes(label)) return false
        if (value && !item.value.toLowerCase().includes(value)) return false
        if (status !== undefined && item.status !== status) return false
        return true
      })
      return apiOk(
        getPageList(filtered, {
          pageNum: Number(query.pageNum) || 1,
          pageSize: Number(query.pageSize) || 10,
        })
      )
    },
  },
  {
    url: '/api/sys/dict/item/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const dictItem = query.id ? findDictItem(query.id) : undefined
      return dictItem ? apiOk(dictItem) : apiErr('字典明细不存在')
    },
  },
  {
    url: '/api/sys/dict/item/create',
    method: 'POST',
    body: ({ body }: { body: CreateDictItemReq }) =>
      apiOk(appendDictItem(body).id),
  },
  {
    url: '/api/sys/dict/item/update',
    method: 'POST',
    body: ({ body }: { body: UpdateDictItemReq }) =>
      updateDictItem(body) ? apiOk(1) : apiErr('字典明细不存在'),
  },
  {
    url: '/api/sys/dict/item/del',
    method: 'POST',
    body: ({ body }: { body: Array<string | number> }) =>
      deleteDictItems(body) ? apiOk(1) : apiErr('字典明细不存在'),
  },
])
