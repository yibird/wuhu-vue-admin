import type { BeforeRetryHook } from 'ky'

const retryHook: BeforeRetryHook = ({ request, retryCount }) => {
  if (import.meta.env.DEV) {
    console.warn(`[ky retry] #${retryCount} ${request.url}`)
  }
}

export const beforeRetry: BeforeRetryHook[] = [retryHook]
