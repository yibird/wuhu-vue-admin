import ky, { type Input, type Options } from 'ky'
import { beforeRequest, beforeError, beforeRetry, afterResponse } from './hooks'

export const kyInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  method: 'post',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest,
    beforeError,
    beforeRetry,
    afterResponse,
  },
})

export async function apiRequest<T>(url: Input, options?: Options) {
  const res = await kyInstance<T>(url, options)
  return res.json()
}
