/**
 * 判断字符串是否为 URL（http/https 协议）
 */
export function isUrl(path?: string) {
  if (!path) return false
  return /^https?:\/\//.test(path)
}

export interface TrustedUrlOptions {
  allowedOrigins?: readonly string[]
  baseUrl?: string
}

const RESOURCE_PROTOCOLS = new Set(['blob:', 'http:', 'https:'])

function getBaseUrl(baseUrl?: string) {
  if (baseUrl) return baseUrl
  if (typeof location !== 'undefined') return location.href
  return 'http://localhost/'
}

function parseUrl(value: string, baseUrl?: string) {
  const normalized = value.trim()
  if (!normalized) return null

  try {
    const url = new URL(normalized, getBaseUrl(baseUrl))
    if (url.username || url.password) return null
    return url
  } catch {
    return null
  }
}

/**
 * Resolve a media/download resource URL while rejecting executable protocols.
 */
export function resolveSafeResourceUrl(value?: string, baseUrl?: string) {
  if (!value) return null
  const url = parseUrl(value, baseUrl)
  if (!url || !RESOURCE_PROTOCOLS.has(url.protocol)) return null
  return url.href
}

/**
 * Resolve an iframe URL against an explicit origin allowlist.
 * Same-origin URLs are always allowed; non-HTTPS cross-origin URLs are rejected.
 */
export function resolveTrustedIframeUrl(
  value: string | undefined,
  options: TrustedUrlOptions = {}
) {
  if (!value) return null
  const baseUrl = getBaseUrl(options.baseUrl)
  const url = parseUrl(value, baseUrl)
  if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
    return null
  }

  const baseOrigin = new URL(baseUrl).origin
  if (url.origin === baseOrigin) return url.href
  if (url.protocol !== 'https:') return null

  const allowedOrigins = new Set(
    (options.allowedOrigins ?? []).flatMap((origin) => {
      const parsed = parseUrl(origin, baseUrl)
      return parsed ? [parsed.origin] : []
    })
  )
  return allowedOrigins.has(url.origin) ? url.href : null
}
