import { type AfterResponseHook } from 'ky'
import { notifySessionExpired } from '../sessionEvents'

const dataResponseHook: AfterResponseHook = async ({ response: res }) => {
  if (res.status === 401) {
    notifySessionExpired()
  }
}

export const afterResponse: AfterResponseHook[] = [dataResponseHook]
