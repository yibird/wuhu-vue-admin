import { defineMock } from 'vite-plugin-mock-dev-server'
import type { CreateUserReq, UpdateUserReq } from '@/apis'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import { appendUser, dataSource, findUser, updateUser } from './data'
import type { BaseQuery } from '#/http'

export default defineMock([
  {
    url: '/api/sys/user/getPageList',
    method: 'GET',
    body: ({ query }: { query: BaseQuery }) => {
      const data = getPageList(dataSource, query)
      return apiOk(data)
    },
  },
  {
    url: '/api/sys/user/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const user = query.id ? findUser(query.id) : undefined
      return user ? apiOk(user) : apiErr('用户不存在')
    },
  },
  {
    url: '/api/sys/user/create',
    method: 'POST',
    body: ({ body }: { body: CreateUserReq }) => {
      appendUser(body)
      return apiOk(1)
    },
  },
  {
    url: '/api/sys/user/update',
    method: 'POST',
    body: ({ body }: { body: UpdateUserReq }) => {
      return updateUser(body) ? apiOk(1) : apiErr('用户不存在')
    },
  },
])
