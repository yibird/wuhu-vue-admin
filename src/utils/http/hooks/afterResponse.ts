import { type AfterResponseHook } from 'ky'
import { router } from '@/router'
import { notifySessionExpired } from '../sessionEvents'

const dataResponseHook: AfterResponseHook = async ({ response: res }) => {
  if (res.status === 401) {
    notifySessionExpired()
    router.replace('/login')
  }
}

export const afterResponse: AfterResponseHook[] = [dataResponseHook]
