import { defineMock } from 'vite-plugin-mock-dev-server'
import { apiOk, getPageList } from '#mock/helper'
import { dataSource } from './data'
import type { BaseQuery } from '#/http'

export default defineMock([
  {
    url: '/api/sys/user/getPageList',
    method: 'GET',
    body: ({ query }: { query: BaseQuery }) => {
      const data = getPageList(dataSource, query)
      return apiOk(data)
    }
  }
])
