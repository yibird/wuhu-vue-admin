import { computed, shallowReactive } from 'vue'
import { toFormOptions } from '../options'
import type {
  FormPlusContext,
  FormPlusOption,
  FormPlusOptionsState,
  FormPlusSchema,
} from '../types'

/**
 * 跨实例共享的选项缓存,仅在 schema 显式声明 cacheKey 时启用
 */
const sharedCache = new Map<string, FormPlusOption[]>()
let cacheVersion = 0

/**
 * 清空共享选项缓存
 */
export function clearFormOptionsCache() {
  cacheVersion += 1
  sharedCache.clear()
}

interface UseFormOptionsOptions {
  /**
   * @desc 表单项配置
   */
  schemas: () => readonly FormPlusSchema[]
  /**
   * @desc 获取联动上下文(getOptions 入参)
   */
  getContext: () => FormPlusContext
  /**
   * @desc 字段当前是否显示,隐藏字段不参与首屏批量加载
   */
  isVisible: (field: string) => boolean
  /**
   * @desc 选项加载失败回调
   */
  onError?: (field: string, error: unknown) => void
}

/**
 * 尚未加载过的字段共用的空状态
 *
 * getState 会在渲染期间被调用,不能在其中写入 stateMap,否则等于在 computed 里产生副作用。
 */
const EMPTY_OPTIONS_STATE: FormPlusOptionsState = {
  options: [],
  loading: false,
  loaded: false,
}

/**
 * 字段选项管理
 *
 * - 非 lazy 字段在挂载后统一批量加载(单个 Promise.all)
 * - 同一字段并发请求去重;显式 cacheKey 时跨实例共享
 * - lazy 字段由控件首次展开下拉/聚焦时按需加载
 */
export function useFormOptions(options: UseFormOptionsOptions) {
  const stateMap = shallowReactive(new Map<string, FormPlusOptionsState>())
  const pending = new Map<string, Promise<FormPlusOption[]>>()

  const schemaMap = computed(
    () => new Map(options.schemas().map((schema) => [schema.field, schema]))
  )

  function ensureState(field: string): FormPlusOptionsState {
    const exist = stateMap.get(field)
    if (exist) return exist

    // 状态对象自身必须是响应式的:加载完成后是就地改写 options/loading/loaded,
    // 只依赖 Map 层的 set 触发不到控件重新渲染。shallow 避免把整份选项数组深度代理。
    const state = shallowReactive<FormPlusOptionsState>({
      options: [],
      loading: false,
      loaded: false,
    })
    stateMap.set(field, state)
    return state
  }

  /**
   * 读取字段选项状态
   *
   * 只读:未加载过的字段返回共享空状态,状态写入统一放在加载/写入入口。
   *
   * @param field 字段名
   */
  function getState(field: string): FormPlusOptionsState {
    return stateMap.get(field) ?? EMPTY_OPTIONS_STATE
  }

  function findSchema(field: string) {
    return schemaMap.value.get(field)
  }

  function resolveCacheKey(schema: FormPlusSchema) {
    if (!schema.cacheKey) return undefined
    return typeof schema.cacheKey === 'function'
      ? schema.cacheKey(options.getContext())
      : schema.cacheKey
  }

  /**
   * 加载单个字段的选项
   *
   * @param field 字段名
   * @param force 是否忽略缓存强制重新加载
   */
  async function loadOne(field: string, force = false) {
    const schema = findSchema(field)
    if (!schema) return []

    const state = ensureState(field)
    const staticOptions = toFormOptions(schema.options)
    if (staticOptions.length > 0 || !schema.getOptions) {
      state.options = staticOptions
      state.loaded = true
      return staticOptions
    }

    if (state.loading) return pending.get(field) ?? state.options

    const cacheKey = resolveCacheKey(schema)
    if (cacheKey && !force) {
      const cached = sharedCache.get(cacheKey)
      if (cached) {
        state.options = cached
        state.loaded = true
        return cached
      }
    }

    const version = cacheVersion
    const getOptions = schema.getOptions
    state.loading = true
    state.error = undefined

    const request = Promise.resolve(getOptions(options.getContext()))
      .then((list) => {
        const normalized = toFormOptions(list)
        state.options = normalized
        state.loaded = true
        if (cacheKey && version === cacheVersion) {
          sharedCache.set(cacheKey, normalized)
        }
        return normalized
      })
      .catch((error: unknown) => {
        state.error = error
        options.onError?.(field, error)
        return state.options
      })
      .finally(() => {
        state.loading = false
        pending.delete(field)
      })

    pending.set(field, request)
    return request
  }

  /**
   * 批量加载首屏需要的选项(非 lazy 且当前可见)
   */
  async function loadEager() {
    const targets = options
      .schemas()
      .filter(
        (schema) =>
          Boolean(schema.getOptions) &&
          !schema.lazy &&
          options.isVisible(schema.field)
      )
    if (!targets.length) return

    await Promise.all(
      targets.map((schema) => loadOne(schema.field).catch(() => undefined))
    )
  }

  /**
   * 直接写入字段选项,常用于联动刷新从表数据源
   */
  function setOptions(field: string, list: FormPlusOption[]) {
    const state = ensureState(field)
    state.options = [...list]
    state.loaded = true
    state.error = undefined
  }

  /**
   * 重新加载选项
   *
   * 首次加载(懒加载字段首次展开)不算刷新,保留共享缓存;
   * 已加载过或上次失败时按强制刷新处理。
   *
   * @param field 不传则重新加载全部 getOptions 字段
   */
  async function reload(field?: string) {
    if (field) {
      const schema = findSchema(field)
      if (!schema?.getOptions) return

      const state = ensureState(field)
      const force = state.loaded || Boolean(state.error)
      const cacheKey = resolveCacheKey(schema)
      if (force && cacheKey) sharedCache.delete(cacheKey)

      await loadOne(field, force)
      return
    }

    clearFormOptionsCache()
    for (const schema of options.schemas()) {
      if (schema.getOptions) {
        const state = ensureState(schema.field)
        state.loaded = false
        state.error = undefined
      }
    }
    await loadEager()
  }

  return {
    getState,
    loadOne,
    loadEager,
    setOptions,
    reload,
  }
}
