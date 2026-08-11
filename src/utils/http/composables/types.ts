import type { Ref } from 'vue'

export interface RequestContext {
  signal: AbortSignal
}

export type Service<TData, TParams extends unknown[]> = (
  ...args: [...TParams, RequestContext]
) => Promise<TData>

export interface UseRequestOptions<TData, TParams extends unknown[]> {
  manual?: boolean
  defaultParams?: TParams
  initialData?: TData
  ready?: Ref<boolean> | (() => boolean)
  refreshDeps?: Array<Ref<unknown> | (() => unknown)>
  debounceWait?: number
  debounceLeading?: boolean
  throttleWait?: number
  throttleLeading?: boolean
  pollingInterval?: number
  pollingWhenHidden?: boolean
  refreshOnWindowFocus?: boolean
  focusTimespan?: number
  onBefore?: (params: TParams) => void
  onSuccess?: (data: TData, params: TParams) => void
  onError?: (error: Error, params: TParams) => void
  onAfter?: (params: TParams) => void
}

export interface UseRequestReturn<TData, TParams extends unknown[]> {
  data: Ref<TData | undefined>
  loading: Ref<boolean>
  error: Ref<Error | undefined>
  run: (...args: TParams) => void
  runAsync: (...args: TParams) => Promise<TData>
  refresh: () => void
  refreshAsync: () => Promise<TData>
  mutate: (data: TData | ((oldData?: TData) => TData)) => void
  cancel: () => void
}
