import type { AppState } from '@/store'

export const APP_CONFIG_VERSION = 1

export interface AppConfigFile {
  version: typeof APP_CONFIG_VERSION
  config: AppState
}

const protectedPaths = new Set(['app.logo'])
const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeConfigNode(
  input: unknown,
  current: unknown,
  path: string
): unknown {
  if (protectedPaths.has(path)) return current

  if (Array.isArray(current)) {
    if (!Array.isArray(input)) throw new Error(`${path} 必须是数组`)
    if (current.length === 0) return [...input]

    const sample = current[0]
    return input.map((item, index) =>
      mergeConfigNode(item, sample, `${path}[${index}]`)
    )
  }

  if (isRecord(current)) {
    if (!isRecord(input)) throw new Error(`${path || 'config'} 必须是对象`)
    const result: Record<string, unknown> = { ...current }

    for (const [key, value] of Object.entries(input)) {
      const childPath = path ? `${path}.${key}` : key
      if (unsafeKeys.has(key)) throw new Error(`${childPath} 是非法字段`)
      if (!Object.hasOwn(current, key))
        throw new Error(`${childPath} 是未知字段`)
      result[key] = mergeConfigNode(value, current[key], childPath)
    }
    return result
  }

  if (current === null) {
    if (input !== null) throw new Error(`${path} 必须为 null`)
    return input
  }

  if (typeof input !== typeof current) {
    throw new Error(`${path} 类型不正确`)
  }
  return input
}

function unwrapConfigFile(value: unknown) {
  if (!isRecord(value)) throw new Error('配置文件必须是对象')

  if (!Object.hasOwn(value, 'version') && !Object.hasOwn(value, 'config')) {
    return value
  }
  if (value.version !== APP_CONFIG_VERSION) {
    throw new Error(`不支持的配置版本：${String(value.version)}`)
  }
  if (!Object.hasOwn(value, 'config')) throw new Error('配置内容缺失')
  return value.config
}

export function parseAppConfig(value: unknown, current: AppState): AppState {
  return mergeConfigNode(unwrapConfigFile(value), current, '') as AppState
}

export function createAppConfigFile(config: AppState): AppConfigFile {
  return { version: APP_CONFIG_VERSION, config }
}
