import { parseNumber } from './number'

const {
  MODE,
  VITE_APP_PORT,
  VITE_APP_NAME,
  VITE_APP_TITLE,
  VITE_API_BASE_URL,
  VITE_API_TIMEOUT,
  VITE_API_RETRY_LIMIT,
  VITE_API_MAX_RETRY_AFTER,
} = import.meta.env

export const appEnv = {
  appPort: parseNumber(VITE_APP_PORT, 5555),
  appName: VITE_APP_NAME,
  appTitle: VITE_APP_TITLE,

  apiBaseUrl: VITE_API_BASE_URL,
  apiTimeout: parseNumber(VITE_API_TIMEOUT, 10000),
  apiRetryLimit: Math.max(0, parseNumber(VITE_API_RETRY_LIMIT, 3)),
  apiMaxRetryAfter: Math.max(0, parseNumber(VITE_API_MAX_RETRY_AFTER, 30000)),
} as const

export const isDev = MODE === 'development'
export const isProd = MODE === 'production'
export const isTest = MODE === 'test'
