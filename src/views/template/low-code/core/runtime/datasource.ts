import type { DataSourceSchema, QuerySchema } from '../schema/types'

export interface QueryExecuteOptions {
  query: QuerySchema
  dataSource: DataSourceSchema | undefined
  /** 已解析的查询参数 */
  params: Record<string, unknown>
  /** 解析 ValueSchema（静态值/表达式） */
  resolveValue: (value: unknown) => unknown
}

function buildUrl(
  url: string,
  params: Record<string, unknown>,
  method: string
): string {
  let result = url
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(params)) {
    const placeholder = `{${key}}`
    if (result.includes(placeholder)) {
      result = result.replaceAll(placeholder, encodeURIComponent(String(value)))
    } else {
      rest[key] = value
    }
  }
  if (method === 'GET' && Object.keys(rest).length) {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined && value !== null)
        search.append(key, String(value))
    }
    const separator = result.includes('?') ? '&' : '?'
    result = `${result}${separator}${search.toString()}`
  }
  return result
}

/** 执行查询：静态数据源直接取值，REST 数据源发起请求 */
export async function executeQuery(
  options: QueryExecuteOptions
): Promise<unknown> {
  const { query, dataSource, params, resolveValue } = options
  if (!dataSource) {
    throw new Error(`查询 ${query.name || query.id} 未绑定数据源`)
  }

  if (dataSource.type === 'static') {
    return resolveValue(dataSource.config.value)
  }

  const url = dataSource.config.url ?? ''
  if (!url) throw new Error(`数据源 ${dataSource.name} 未配置请求地址`)

  const method = dataSource.config.method ?? 'GET'
  const controller = new AbortController()
  const timeout = dataSource.config.timeout ?? 15000
  const timer = window.setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(buildUrl(url, params, method), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...dataSource.config.headers,
      },
      body:
        method === 'GET' || method === 'DELETE'
          ? undefined
          : JSON.stringify(params),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as Record<string, unknown>
      // 兼容常见后端包装结构
      if (
        payload &&
        typeof payload === 'object' &&
        'data' in payload &&
        Object.keys(payload).length <= 3
      ) {
        return payload.data
      }
      return payload
    }
    return response.text()
  } finally {
    window.clearTimeout(timer)
  }
}
