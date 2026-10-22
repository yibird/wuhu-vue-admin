import { defineMock, type MockRequest } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import {
  appendDictData,
  appendDictType,
  deleteDictData,
  deleteDictTypes,
  dictDataDataSource,
  dictTypeDataSource,
  findDictData,
  findDictDataByValue,
  findDictType,
  findDictTypeByType,
  updateDictData,
  updateDictType,
} from './data'

import type {
  SysDictDataCreateReq,
  SysDictTypeCreateReq,
  SysDictDataUpdateReq,
  SysDictTypeUpdateReq,
} from '@/apis'

type Query = Record<string, unknown>

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function readNumber(value: unknown) {
  if (value === undefined || value === '' || value === null) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function readIds(body: unknown) {
  return Array.isArray(body) ? body.map(String) : []
}

function parseBoolean(value: unknown) {
  if (value === undefined || value === '' || value === null) return undefined
  return value === true || value === 'true' || value === 1 || value === '1'
}

function includesKeyword(source: string, keyword: string) {
  return source.toLowerCase().includes(keyword.toLowerCase())
}

function normalizePage(query: Query) {
  return {
    current: readNumber(query.current) ?? 1,
    pageSize: readNumber(query.pageSize) ?? 10,
  }
}

export default defineMock([
  // ============================================================
  // 字典类型
  // ============================================================
  {
    url: '/api/sys/dict/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const name = readString(q.name)
      const type = readString(q.type)
      const status = parseBoolean(q.status)

      const filtered = dictTypeDataSource
        .filter((item) => {
          if (name && !includesKeyword(item.name, name)) return false
          if (type && !includesKeyword(item.type, type)) return false
          if (status !== undefined && item.status !== status) return false
          return true
        })
        .sort((left, right) => (left.sort ?? 0) - (right.sort ?? 0))

      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/sys/dict/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const dict = findDictType(readString((query as Query).id))
      return dict ? apiOk(dict) : apiErr('字典不存在')
    },
  },
  {
    url: '/api/sys/dict/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as SysDictTypeCreateReq
      if (!input?.name?.trim()) return apiErr('请输入字典名称')
      if (!input?.type?.trim()) return apiErr('请输入字典类型')
      if (findDictTypeByType(input.type.trim())) {
        return apiErr(`字典类型「${input.type.trim()}」已存在`)
      }
      return apiOk(appendDictType(input).id)
    },
  },
  {
    url: '/api/sys/dict/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as SysDictTypeUpdateReq
      if (!findDictType(input?.id ?? '')) return apiErr('字典不存在')
      if (input.name !== undefined && !input.name.trim()) {
        return apiErr('请输入字典名称')
      }
      if (input.type !== undefined && !input.type.trim()) {
        return apiErr('请输入字典类型')
      }
      if (
        input.type !== undefined &&
        findDictTypeByType(input.type.trim(), input.id)
      ) {
        return apiErr(`字典类型「${input.type.trim()}」已存在`)
      }
      const dict = updateDictType(input)
      return dict ? apiOk(dict.id) : apiErr('字典不存在')
    },
  },
  {
    url: '/api/sys/dict/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的字典')
      deleteDictTypes(ids)
      return apiOk(ids.length)
    },
  },

  // ============================================================
  // 字典数据
  // ============================================================
  {
    url: '/api/sys/dict/item/getPageList',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const q = query as Query
      const dictId = readString(q.dictId)
      const label = readString(q.label)
      const value = readString(q.value)
      const status = parseBoolean(q.status)

      const filtered = dictDataDataSource
        .filter((item) => {
          if (dictId && item.dictId !== dictId) return false
          if (label && !includesKeyword(item.label, label)) return false
          if (value && !includesKeyword(item.value, value)) return false
          if (status !== undefined && item.status !== status) return false
          return true
        })
        .sort((left, right) => (left.sort ?? 0) - (right.sort ?? 0))

      return apiOk(getPageList(filtered, normalizePage(q)))
    },
  },
  {
    url: '/api/sys/dict/item/getRecord',
    method: 'GET',
    body: ({ query }: MockRequest) => {
      const item = findDictData(readString((query as Query).id))
      return item ? apiOk(item) : apiErr('字典数据不存在')
    },
  },
  {
    url: '/api/sys/dict/item/create',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as SysDictDataCreateReq
      if (!input?.dictId || !findDictType(input.dictId)) {
        return apiErr('请选择有效的所属字典')
      }
      if (!input?.label?.trim()) return apiErr('请输入字典标签')
      if (!input?.value?.trim()) return apiErr('请输入字典值')
      if (findDictDataByValue(input.dictId, input.value.trim())) {
        return apiErr(`字典值「${input.value.trim()}」已存在`)
      }
      return apiOk(appendDictData(input).id)
    },
  },
  {
    url: '/api/sys/dict/item/update',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const input = body as SysDictDataUpdateReq
      if (!findDictData(input?.id ?? '')) return apiErr('字典数据不存在')
      if (input.dictId !== undefined && !findDictType(input.dictId)) {
        return apiErr('请选择有效的所属字典')
      }
      if (input.label !== undefined && !input.label.trim()) {
        return apiErr('请输入字典标签')
      }
      if (input.value !== undefined && !input.value.trim()) {
        return apiErr('请输入字典值')
      }
      if (input.value !== undefined) {
        const current = findDictData(input.id)
        const dictId = input.dictId ?? current?.dictId ?? ''
        if (findDictDataByValue(dictId, input.value.trim(), input.id)) {
          return apiErr(`字典值「${input.value.trim()}」已存在`)
        }
      }
      const item = updateDictData(input)
      return item ? apiOk(item.id) : apiErr('字典数据不存在')
    },
  },
  {
    url: '/api/sys/dict/item/del',
    method: 'POST',
    body: ({ body }: MockRequest) => {
      const ids = readIds(body)
      if (!ids.length) return apiErr('请选择要删除的字典数据')
      deleteDictData(ids)
      return apiOk(ids.length)
    },
  },
])
