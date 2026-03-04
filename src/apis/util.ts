import { apiRequest } from '@/utils'
import { RequestMethod } from '@/constant'

import type { PageResult, Result } from '#/http'

export function getBaseApi<
  T extends Record<string, any> = object,
  R extends Record<string, any> = object,
  C extends Record<string, any> = object,
  U extends Record<string, any> = object,
>(apiPrefix: string) {
  return {
    getPageListApi<Q>(data?: Q extends Record<string, any> ? Q : never) {
      return apiRequest<Result<PageResult<T>>>(`${apiPrefix}/getPageList`, {
        method: RequestMethod.GET,
        searchParams: data,
      })
    },
    getRecordApi<Q>(
      data?: Q extends Record<string, any> ? Q : never
    ): Promise<any> {
      return apiRequest<Result<R>>(`${apiPrefix}/getRecord`, {
        method: RequestMethod.GET,
        searchParams: data,
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
