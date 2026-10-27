import { apiRequest } from '@/utils'
import { HTTP_METHOD } from '@/constants'
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
        method: HTTP_METHOD.Get,
        searchParams: toSearchParams(data),
      })
    },
    getRecordApi<Q extends object = Record<string, never>>(data?: Q) {
      return apiRequest<Result<R>>(`${apiPrefix}/getRecord`, {
        method: HTTP_METHOD.Get,
        searchParams: toSearchParams(data),
      })
    },
    createApi<V = number>(data: C) {
      return apiRequest<Result<V>>(`${apiPrefix}/create`, {
        method: HTTP_METHOD.Post,
        json: data,
      })
    },
    updateApi<V = number>(data: U) {
      return apiRequest<Result<V>>(`${apiPrefix}/update`, {
        method: HTTP_METHOD.Post,
        json: data,
      })
    },
    deleteApi<V = number>(data: Array<string | number>) {
      return apiRequest<Result<V>>(`${apiPrefix}/del`, {
        method: HTTP_METHOD.Post,
        json: data,
      })
    },
  }
}
