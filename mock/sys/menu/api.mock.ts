import { defineMock } from 'vite-plugin-mock-dev-server'
import { apiErr, apiOk, getPageList } from '#mock/helper'
import { findMenu, menuDataSource } from './data'

function parseBoolean(value: unknown) {
  if (value === undefined) return undefined
  return value === true || value === 'true' || value === 1 || value === '1'
}

export default defineMock([
  {
    url: '/api/sys/menu/getPageList',
    method: 'GET',
    body: ({ query }: { query: Record<string, unknown> }) => {
      const name = String(query.name ?? '')
        .trim()
        .toLowerCase()
      const status = parseBoolean(query.status)
      const filtered = menuDataSource.filter((item) => {
        if (name && !item.name.toLowerCase().includes(name)) return false
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
    url: '/api/sys/menu/getRecord',
    method: 'GET',
    body: ({ query }: { query: { id?: string } }) => {
      const menu = query.id ? findMenu(query.id) : undefined
      return menu ? apiOk(menu) : apiErr('菜单不存在')
    },
  },
])
