import {
  computed,
  shallowReactive,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'

/**
 * @desc 字典选项
 */
export interface DictOption {
  /**
   * @desc 展示文案
   */
  label: string
  /**
   * @desc 选项值
   */
  value: string
  /**
   * @desc 是否禁用
   */
  disabled?: boolean
}

/**
 * @desc 字典数据源,默认走项目字典接口
 */
export type DictLoader = (type: string) => Promise<DictOption[]>

interface DictEntry {
  /**
   * @desc 已加载的选项
   */
  options: DictOption[]
  /**
   * @desc 是否正在加载
   */
  loading: boolean
  /**
   * @desc 是否已完成过一次加载(空字典也视为已加载,避免重复请求)
   */
  loaded: boolean
  /**
   * @desc 加载错误
   */
  error?: Error
}

const EMPTY_OPTIONS: DictOption[] = []

/**
 * @desc 项目字典列表接口单页条数
 *
 * 字典数量有限,取足够大的一页后按类型精确匹配。
 */
const DICT_PAGE_SIZE = 100

/**
 * @desc 项目字典项接口单页条数
 */
const DICT_ITEM_PAGE_SIZE = 200

/**
 * @desc 全局字典状态,所有 useDict 实例共享
 */
const dictStore = shallowReactive(new Map<string, DictEntry>())

/**
 * @desc 进行中的加载,用于合并同一字典的并发请求
 */
const pendingLoads = new Map<string, Promise<DictOption[]>>()

/**
 * @desc 缓存代次,clearDictCache 后递增,阻止在途请求回写已被清空的缓存
 */
let cacheGeneration = 0

function normalizeType(type: unknown): string {
  return String(type ?? '').trim()
}

function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause))
}

function updateEntry(type: string, patch: Partial<DictEntry>): void {
  const current = dictStore.get(type)
  dictStore.set(type, {
    options: current?.options ?? EMPTY_OPTIONS,
    loading: current?.loading ?? false,
    loaded: current?.loaded ?? false,
    error: current?.error,
    ...patch,
  })
}

/**
 * @desc 默认数据源:先按 type 精确定位字典,再取其启用中的字典项
 *
 * 动态导入请求层,避免 hooks 模块直接依赖 http 客户端。
 *
 * @param type 字典类型
 * @returns 字典选项
 */
async function defaultLoader(type: string): Promise<DictOption[]> {
  const { getDictPageListApi, getDictItemPageListApi } = await import('@/apis')

  const dictPage = await getDictPageListApi({
    type,
    pageNum: 1,
    pageSize: DICT_PAGE_SIZE,
  })
  const dict = dictPage.data.list.find((item) => item.type === type)
  if (!dict) return []

  const itemPage = await getDictItemPageListApi({
    dictId: dict.id,
    status: true,
    pageNum: 1,
    pageSize: DICT_ITEM_PAGE_SIZE,
  })
  return itemPage.data.list.map((item) => ({
    label: item.label,
    value: item.value,
  }))
}

let dictLoader: DictLoader = defaultLoader

/**
 * @desc 覆盖字典数据源
 * @param loader 数据源实现
 */
export function setDictLoader(loader: DictLoader): void {
  dictLoader = loader
}

/**
 * @desc 加载字典选项,命中缓存或进行中的请求时直接复用
 * @param type 字典类型
 * @returns 字典选项
 */
export function loadDict(type: string): Promise<DictOption[]> {
  const code = normalizeType(type)
  if (!code) return Promise.resolve(EMPTY_OPTIONS)

  const entry = dictStore.get(code)
  if (entry?.loaded) return Promise.resolve(entry.options)

  const pending = pendingLoads.get(code)
  if (pending) return pending

  const generation = cacheGeneration
  updateEntry(code, { loading: true, error: undefined })

  const request = dictLoader(code)
    .then((options) => {
      const result = Array.isArray(options) ? options : EMPTY_OPTIONS
      // 缓存已被清理时丢弃结果,避免回写过期数据
      if (generation === cacheGeneration) {
        updateEntry(code, { options: result, loading: false, loaded: true })
      }
      return result
    })
    .catch((cause) => {
      const error = toError(cause)
      if (generation === cacheGeneration) {
        updateEntry(code, { loading: false, error })
      }
      throw error
    })
    .finally(() => {
      if (pendingLoads.get(code) === request) pendingLoads.delete(code)
    })

  pendingLoads.set(code, request)
  return request
}

/**
 * @desc 强制重新加载字典(忽略缓存)
 * @param type 字典类型
 * @returns 字典选项
 */
export function reloadDict(type: string): Promise<DictOption[]> {
  const code = normalizeType(type)
  if (!code) return Promise.resolve(EMPTY_OPTIONS)
  dictStore.delete(code)
  return loadDict(code)
}

/**
 * @desc 读取已缓存的字典选项(同步,不触发请求)
 * @param type 字典类型
 * @returns 字典选项
 */
export function getDictOptions(type: string): DictOption[] {
  return dictStore.get(normalizeType(type))?.options ?? EMPTY_OPTIONS
}

function findLabel(options: DictOption[], value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined
  return options.find((item) => item.value === String(value))?.label
}

/**
 * @desc 读取字典标签(同步,未加载时返回兜底值)
 * @param type 字典类型
 * @param value 字典值
 * @param fallback 未匹配时的兜底文案
 * @returns 标签文案
 */
export function getDictLabel(
  type: string,
  value: unknown,
  fallback = ''
): string {
  return findLabel(getDictOptions(type), value) ?? fallback
}

/**
 * @desc 清空字典缓存
 * @param type 指定类型时只清理该字典
 */
export function clearDictCache(type?: string): void {
  cacheGeneration += 1

  if (type === undefined) {
    dictStore.clear()
    pendingLoads.clear()
    return
  }

  const code = normalizeType(type)
  dictStore.delete(code)
  pendingLoads.delete(code)
}

/**
 * @desc 字典 Hooks
 *
 * 首次使用时按需加载,同一字典在全局共享缓存与进行中的请求;
 * 缓存需在登录态切换或字典维护后通过 clearDictCache 主动失效。
 *
 * @param type 字典类型
 * @returns 字典选项、加载状态与操作
 */
export function useDict(type: MaybeRefOrGetter<string>) {
  const code = computed(() => normalizeType(toValue(type)))
  const options = computed(
    () => dictStore.get(code.value)?.options ?? EMPTY_OPTIONS
  )
  const loading = computed(() => dictStore.get(code.value)?.loading ?? false)
  const error = computed(() => dictStore.get(code.value)?.error)

  watch(
    code,
    (value) => {
      if (!value) return
      void loadDict(value).catch(() => {
        // 加载失败由 error 反馈,这里只避免未处理的 rejection
      })
    },
    { immediate: true }
  )

  function label(value: unknown, fallback = ''): string {
    return findLabel(options.value, value) ?? fallback
  }

  function refresh(): Promise<DictOption[]> {
    return reloadDict(code.value)
  }

  return {
    options,
    loading,
    error,
    label,
    refresh,
  }
}
