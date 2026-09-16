import { defineMock } from 'vite-plugin-mock-dev-server'
import type { CreateDeptReq, UpdateDeptReq } from '@/apis'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import { appendDept, dataSource, findDept, updateDept } from './data'

export default defineMock([
  {
    url: '/api/sys/dept/getPageList',
    method: 'GET',
    body: ({ query }: { query: Record<string, unknown> }) => {
      const name = String(query.name ?? '')
        .trim()
        .toLowerCase()
      const code = String(query.code ?? '')
        .trim()
        .toLowerCase()
      const type = query.type === undefined ? undefined : Number(query.type)
      const filtered = dataSource.filter((item) => {
        if (type !== undefined && item.type !== type) return false
        if (name && !item.name.toLowerCase().includes(name)) return false
        if (code && !item.code.toLowerCase().includes(code)) return false
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
    url: '/api/sys/dept/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const dept = query.id ? findDept(query.id) : undefined
      return dept ? apiOk(dept) : apiErr('部门或岗位不存在')
    },
  },
  {
    url: '/api/sys/dept/create',
    method: 'POST',
    body: ({ body }: { body: CreateDeptReq }) => {
      appendDept({
        ...body,
        dataStatus: true,
        deleted: false,
        createdBy: '系统管理员',
        version: 1,
      })
      return apiOk(1)
    },
  },
  {
    url: '/api/sys/dept/update',
    method: 'POST',
    body: ({ body }: { body: UpdateDeptReq }) => {
      return updateDept(body) ? apiOk(1) : apiErr('部门或岗位不存在')
    },
  },
])
