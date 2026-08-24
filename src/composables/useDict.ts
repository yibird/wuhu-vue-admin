import {
  computed,
  shallowReactive,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'

export type DictValue = string | number
export type DictRawItem = Record<string, unknown>

export interface DictItem {
  label: string
  value: DictValue
  disabled?: boolean
  [key: string]: unknown
}

export interface DictNormalizeOptions {
  labelKey?: string
  valueKey?: string
  disabledKey?: string
  filter?: (raw: DictRawItem) => boolean
  transform?: (raw: DictRawItem) => DictItem
}

export interface UseDictOptions extends DictNormalizeOptions {
  fetcher?: DictFetcher
  immediate?: boolean
  refreshOnMount?: boolean
}

export type DictFetcher = (
  code: string,
  signal?: AbortSignal
) => Promise<DictRawItem[]>

const DEFAULT_LABEL_KEY = 'label'
const DEFAULT_VALUE_KEY = 'value'
const DEFAULT_DISABLED_KEY = 'disabled'

// 缓存状态
const dictCache = shallowReactive<Record<string, DictRawItem[]>>({})
const dictLoading = shallowReactive<Record<string, boolean>>({})
const dictErrors = shallowReactive<Record<string, Error | undefined>>({})
const pendingRequests = new Map<
  string,
  {
    controller: AbortController
    generation: number
    promise: Promise<DictRawItem[]>
  }
>()
const keyGenerations = new Map<string, number>()

let cacheScope = 'anonymous'
let cacheGeneration = 0
let defaultFetcher: DictFetcher | undefined

function normalizeCode(code: string | null | undefined): string {
  return String(code ?? '').trim()
}

function getCacheKey(code: string) {
  return `${cacheScope}:${normalizeCode(code)}`
}

function invalidateKey(key: string) {
  keyGenerations.set(key, (keyGenerations.get(key) ?? 0) + 1)
  pendingRequests.get(key)?.controller.abort()
  pendingRequests.delete(key)
}

function toLabel(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function toDictValue(value: unknown): DictValue {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value === null || value === undefined) return ''
  return String(value)
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}

function isSameValue(left: unknown, right: unknown): boolean {
  return Object.is(left, right) || String(left) === String(right)
}

function normalizeDictItem(
  raw: DictRawItem,
  options: DictNormalizeOptions = {}
): DictItem {
  if (options.transform) return options.transform(raw)

  const labelKey = options.labelKey ?? DEFAULT_LABEL_KEY
  const valueKey = options.valueKey ?? DEFAULT_VALUE_KEY
  const disabledKey = options.disabledKey ?? DEFAULT_DISABLED_KEY

  const disabled = raw[disabledKey]
  const result: DictItem = {
    ...raw,
    label: toLabel(raw[labelKey]),
    value: toDictValue(raw[valueKey]),
  }

  if (disabled !== null && disabled !== undefined) {
    result.disabled = Boolean(disabled)
  }

  return result
}

function normalizeDictItems(
  items: DictRawItem[],
  options: DictNormalizeOptions = {}
): DictItem[] {
  if (!items?.length) return []

  const filtered = options.filter ? items.filter(options.filter) : items
  return filtered.map((raw) => normalizeDictItem(raw, options))
}

function findItemByValue(
  items: DictItem[],
  value: DictValue | null | undefined
): DictItem | undefined {
  if (value === null || value === undefined) return undefined
  return items.find((item) => isSameValue(item.value, value))
}

// ============ 全局 API ============

export function setDictFetcher(fetcher: DictFetcher): void {
  defaultFetcher = fetcher
}

export function setDictCacheScope(scope: string): void {
  const normalizedScope = scope.trim() || 'anonymous'
  if (normalizedScope === cacheScope) return
  clearDictCache()
  cacheScope = normalizedScope
}

export function getDictCache(code: string): DictRawItem[] {
  const key = getCacheKey(code)
  return [...(dictCache[key] ?? [])]
}

export function hasDictCache(code: string): boolean {
  const normalizedCode = normalizeCode(code)
  return normalizedCode !== '' && getCacheKey(normalizedCode) in dictCache
}

export function setDictCache(code: string, items: DictRawItem[]): void {
  const normalizedCode = normalizeCode(code)
  if (!normalizedCode) return
  const key = getCacheKey(normalizedCode)

  dictCache[key] = [...items]
  delete dictErrors[key]
}

export function clearDictCache(code?: string): void {
  if (code) {
    const key = getCacheKey(code)
    invalidateKey(key)
    delete dictCache[key]
    delete dictLoading[key]
    delete dictErrors[key]
    return
  }

  cacheGeneration += 1
  pendingRequests.forEach(({ controller }) => controller.abort())
  for (const key of Object.keys(dictCache)) delete dictCache[key]
  for (const key of Object.keys(dictLoading)) delete dictLoading[key]
  for (const key of Object.keys(dictErrors)) delete dictErrors[key]
  pendingRequests.clear()
  keyGenerations.clear()
}

export function isDictLoading(code: string): boolean {
  return Boolean(dictLoading[getCacheKey(code)])
}

export function getDictError(code: string): Error | undefined {
  return dictErrors[getCacheKey(code)]
}

export function getDictOptions(
  code: string,
  options: DictNormalizeOptions = {}
): DictItem[] {
  return normalizeDictItems(getDictCache(code), options)
}

export function getDictItem(
  code: string,
  value: DictValue | null | undefined,
  options: DictNormalizeOptions = {}
): DictItem | undefined {
  const items = getDictOptions(code, options)
  return findItemByValue(items, value)
}

export function getDictLabel(
  code: string,
  value: DictValue | null | undefined,
  fallback = '',
  options: DictNormalizeOptions = {}
): string {
  return getDictItem(code, value, options)?.label ?? fallback
}

export async function refreshDict(
  code: string,
  fetcher?: DictFetcher
): Promise<DictRawItem[]> {
  const normalizedCode = normalizeCode(code)
  if (!normalizedCode) return []
  const key = getCacheKey(normalizedCode)

  const requestFetcher = fetcher ?? defaultFetcher
  if (!requestFetcher) {
    const error = new Error('Missing dict fetcher')
    dictErrors[key] = error
    throw error
  }

  // 合并并发请求
  const pending = pendingRequests.get(key)
  if (pending) return await pending.promise

  const controller = new AbortController()
  const generation = keyGenerations.get(key) ?? 0
  const globalGeneration = cacheGeneration
  dictLoading[key] = true
  delete dictErrors[key]

  const request = requestFetcher(normalizedCode, controller.signal)
    .then((items) => {
      if (
        controller.signal.aborted ||
        globalGeneration !== cacheGeneration ||
        generation !== (keyGenerations.get(key) ?? 0)
      ) {
        return []
      }
      dictCache[key] = Array.isArray(items) ? [...items] : []
      return dictCache[key]
    })
    .catch((error) => {
      if (controller.signal.aborted) return []
      const normalizedError = toError(error)
      dictErrors[key] = normalizedError
      throw normalizedError
    })
    .finally(() => {
      if (pendingRequests.get(key)?.controller === controller) {
        pendingRequests.delete(key)
        dictLoading[key] = false
      }
    })

  pendingRequests.set(key, { controller, generation, promise: request })
  return await request
}

export async function refreshDicts(
  codes: readonly string[],
  fetcher?: DictFetcher
): Promise<Record<string, DictRawItem[]>> {
  const uniqueCodes = [...new Set(codes.map(normalizeCode).filter(Boolean))]
  const results = await Promise.all(
    uniqueCodes.map(async (code) => [code, await refreshDict(code, fetcher)])
  )
  return Object.fromEntries(results)
}

// ============ Composable ============

export function useDict(
  code: MaybeRefOrGetter<string>,
  options: UseDictOptions = {}
) {
  const immediate = options.immediate ?? true
  const refreshOnMount = options.refreshOnMount ?? false

  const currentCode = computed(() => normalizeCode(toValue(code)))

  const options_computed = computed(() =>
    getDictOptions(currentCode.value, options)
  )

  const loading = computed(() => isDictLoading(currentCode.value))
  const error = computed(() => getDictError(currentCode.value))
  const hasCache = computed(() => hasDictCache(currentCode.value))

  function shouldRefresh(dictCode: string): boolean {
    if (!immediate || !dictCode) return false
    return refreshOnMount || !hasDictCache(dictCode)
  }

  function autoRefresh(dictCode: string): void {
    if (!shouldRefresh(dictCode)) return

    const fetcher = options.fetcher ?? defaultFetcher
    if (!fetcher) return

    refreshDict(dictCode, fetcher).catch(() => {})
  }

  async function refresh(): Promise<DictRawItem[]> {
    return refreshDict(currentCode.value, options.fetcher)
  }

  function getItem(value: DictValue | null | undefined): DictItem | undefined {
    return findItemByValue(options_computed.value, value)
  }

  function getLabel(
    value: DictValue | null | undefined,
    fallback = ''
  ): string {
    return getItem(value)?.label ?? fallback
  }

  function getLabels(
    values: Array<DictValue | null | undefined>,
    separator = ','
  ): string {
    return values
      .map((v) => getLabel(v))
      .filter(Boolean)
      .join(separator)
  }

  watch(currentCode, autoRefresh, { immediate: true })

  return {
    code: currentCode,
    options: options_computed,
    loading,
    error,
    hasCache,
    refresh,
    getItem,
    getLabel,
    getLabels,
  }
}

export function useDicts(
  codes: MaybeRefOrGetter<readonly string[]>,
  options: UseDictOptions = {}
) {
  const immediate = options.immediate ?? true
  const refreshOnMount = options.refreshOnMount ?? false

  const currentCodes = computed(() => {
    const raw = toValue(codes)
    return [...new Set(raw.map(normalizeCode).filter(Boolean))]
  })

  const optionsMap = computed(() => {
    const result: Record<string, DictItem[]> = {}
    for (const code of currentCodes.value) {
      result[code] = getDictOptions(code, options)
    }
    return result
  })

  const loading = computed(() =>
    currentCodes.value.some((code) => isDictLoading(code))
  )

  const hasCache = computed(() =>
    currentCodes.value.every((code) => hasDictCache(code))
  )

  function shouldRefresh(dictCode: string): boolean {
    if (!immediate || !dictCode) return false
    return refreshOnMount || !hasDictCache(dictCode)
  }

  function autoRefresh(dictCodes: string[]): void {
    const fetcher = options.fetcher ?? defaultFetcher
    if (!fetcher) return

    dictCodes.forEach((code) => {
      if (shouldRefresh(code)) {
        refreshDict(code, fetcher).catch(() => {})
      }
    })
  }

  async function refresh(): Promise<Record<string, DictRawItem[]>> {
    return refreshDicts(currentCodes.value, options.fetcher)
  }

  watch(currentCodes, autoRefresh, { immediate: true })

  return {
    codes: currentCodes,
    optionsMap,
    loading,
    hasCache,
    refresh,
  }
}
