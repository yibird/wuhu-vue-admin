import { apiRequest } from '@/utils'
import { RequestMethod } from '@/constants'

import type { PageResult, Result } from '#/http'

function toSearchParams(data?: object) {
  if (!data) return undefined

  const searchParams = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value))
  })
  return searchParams
}

export function getBaseApi<
  T extends object = Record<string, never>,
  R extends object = Record<string, never>,
  C extends object = Record<string, never>,
  U extends object = Record<string, never>,
>(apiPrefix: string) {
  return {
    getPageListApi<Q extends object = Record<string, never>>(data?: Q) {
      return apiRequest<Result<PageResult<T>>>(`${apiPrefix}/getPageList`, {
        method: RequestMethod.GET,
        searchParams: toSearchParams(data),
      })
    },
    getRecordApi<Q extends object = Record<string, never>>(data?: Q) {
      return apiRequest<Result<R>>(`${apiPrefix}/getRecord`, {
        method: RequestMethod.GET,
        searchParams: toSearchParams(data),
      })
    },
    createApi<V = number>(data: C) {
      return apiRequest<Result<V>>(`${apiPrefix}/create`, {
        method: RequestMethod.POST,
        json: data,
      })
    },
    updateApi<V = number>(data: U) {
      return apiRequest<Result<V>>(`${apiPrefix}/update`, {
        method: RequestMethod.POST,
        json: data,
      })
    },
    deleteApi<V = number>(data: Array<string | number>) {
      return apiRequest<Result<V>>(`${apiPrefix}/del`, {
        method: RequestMethod.POST,
        json: data,
      })
    },
  }
}
