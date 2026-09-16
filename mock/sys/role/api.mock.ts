import { defineMock } from 'vite-plugin-mock-dev-server'
import type { CreateRoleReq, UpdateRoleReq } from '@/apis'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import { appendRole, dataSource, findRole, updateRole } from './data'

import type { BaseQuery } from '#/http'

export default defineMock([
  {
    url: '/api/sys/role/getPageList',
    method: 'GET',
    body: ({ query }: { query: BaseQuery }) => {
      const data = getPageList(dataSource, query)
      return apiOk(data)
    },
  },
  {
    url: '/api/sys/role/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const role = query.id ? findRole(query.id) : undefined
      return role ? apiOk(role) : apiErr('角色不存在')
    },
  },
  {
    url: '/api/sys/role/create',
    method: 'POST',
    body: ({ body }: { body: CreateRoleReq }) => {
      appendRole(body)
      return apiOk(1)
    },
  },
  {
    url: '/api/sys/role/update',
    method: 'POST',
    body: ({ body }: { body: UpdateRoleReq }) => {
      return updateRole(body) ? apiOk(1) : apiErr('角色不存在')
    },
  },
])
