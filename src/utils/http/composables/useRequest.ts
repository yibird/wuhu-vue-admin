import {
  computed,
  isRef,
  nextTick,
  onScopeDispose,
  shallowRef,
  watch,
  type Ref,
} from 'vue'
import {
  useDebounceFn,
  useDocumentVisibility,
  useThrottleFn,
} from '@vueuse/core'

import type {
  RequestContext,
  Service,
  UseRequestOptions,
  UseRequestReturn,
} from './types'

export type { RequestContext, Service, UseRequestOptions, UseRequestReturn }

interface CancellableFunction {
  cancel?: () => void
}

function toError(value: unknown) {
  return value instanceof Error ? value : new Error(String(value))
}

export function isAbortError(value: unknown) {
  return (
    (value instanceof DOMException && value.name === 'AbortError') ||
    (value instanceof Error && value.name === 'AbortError')
  )
}

export function useRequest<TData, TParams extends unknown[] = unknown[]>(
  service: Service<TData, TParams>,
  options: UseRequestOptions<TData, TParams> = {}
): UseRequestReturn<TData, TParams> {
  const {
    manual = false,
    defaultParams = [] as unknown as TParams,
    initialData,
    ready,
    refreshDeps,
    debounceWait,
    debounceLeading = false,
    throttleWait,
    throttleLeading = true,
    pollingInterval,
    pollingWhenHidden = true,
    refreshOnWindowFocus = false,
    focusTimespan = 5000,
    onBefore,
    onSuccess,
    onError,
    onAfter,
  } = options

  const data = shallowRef<TData | undefined>(initialData) as Ref<
    TData | undefined
  >
  const loading = shallowRef(false)
  const error = shallowRef<Error>()
  const docVisibility = useDocumentVisibility()

  let requestCount = 0
  let lastParams: TParams = defaultParams
  let controller: AbortController | null = null
  let pollingTimer: ReturnType<typeof setTimeout> | null = null
  let stopVisibilityPollingWatch: (() => void) | null = null
  let cleanupWindowFocus: (() => void) | null = null
  let cancelScheduledRun: (() => void) | null = null
  let disposed = false

  async function execute(...args: TParams): Promise<TData> {
    controller?.abort()
    const currentController = new AbortController()
    controller = currentController
    const currentCount = ++requestCount
    lastParams = args

    onBefore?.(args)
    loading.value = true
    error.value = undefined

    try {
      const context: RequestContext = { signal: currentController.signal }
      const result = await service(...args, context)
      if (currentCount !== requestCount) return result

      data.value = result
      onSuccess?.(result, args)
      return result
    } catch (cause) {
      if (currentCount !== requestCount || currentController.signal.aborted) {
        throw cause
      }

      const requestError = toError(cause)
      error.value = requestError
      onError?.(requestError, args)
      throw cause
    } finally {
      if (controller === currentController) controller = null
      if (currentCount === requestCount) {
        loading.value = false
        onAfter?.(args)
      }
    }
  }

  function run(...args: TParams): void {
    execute(...args).catch(() => {})
  }

  function runAsync(...args: TParams): Promise<TData> {
    return execute(...args)
  }

  function refresh(): void {
    run(...lastParams)
  }

  function refreshAsync(): Promise<TData> {
    return runAsync(...lastParams)
  }

  function mutate(newData: TData | ((oldData?: TData) => TData)): void {
    data.value =
      typeof newData === 'function'
        ? (newData as (oldData?: TData) => TData)(data.value)
        : newData
  }

  function stopPolling() {
    if (pollingTimer) {
      clearTimeout(pollingTimer)
      pollingTimer = null
    }
    stopVisibilityPollingWatch?.()
    stopVisibilityPollingWatch = null
  }

  function cancel(): void {
    requestCount++
    controller?.abort()
    controller = null
    cancelScheduledRun?.()
    loading.value = false
    stopPolling()
  }

  let wrappedRun: (...args: TParams) => void = run

  if (debounceWait && debounceWait > 0) {
    if (debounceLeading) {
      let debounceTimer: ReturnType<typeof setTimeout> | null = null
      wrappedRun = (...args: TParams) => {
        const shouldRun = debounceTimer === null
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          debounceTimer = null
        }, debounceWait)
        if (shouldRun) run(...args)
      }
      cancelScheduledRun = () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = null
      }
    } else {
      const debouncedRun = useDebounceFn(run, debounceWait)
      wrappedRun = (...args: TParams) => {
        void debouncedRun(...args)
      }
      cancelScheduledRun = () =>
        (debouncedRun as CancellableFunction).cancel?.()
    }
  } else if (throttleWait && throttleWait > 0) {
    const throttledRun = useThrottleFn(run, throttleWait, true, throttleLeading)
    wrappedRun = (...args: TParams) => {
      void throttledRun(...args)
    }
    cancelScheduledRun = () => (throttledRun as CancellableFunction).cancel?.()
  }

  function startPolling() {
    if (!pollingInterval || pollingInterval <= 0) return
    stopPolling()

    if (!pollingWhenHidden && docVisibility.value === 'hidden') {
      stopVisibilityPollingWatch = watch(docVisibility, (visibility) => {
        if (visibility !== 'visible') return
        stopVisibilityPollingWatch?.()
        stopVisibilityPollingWatch = null
        startPolling()
      })
      return
    }

    pollingTimer = setTimeout(() => {
      if (disposed) return
      refresh()
      startPolling()
    }, pollingInterval)
  }

  if (refreshOnWindowFocus) {
    const throttledRefresh = useThrottleFn(
      () => {
        if (!disposed) refresh()
      },
      focusTimespan,
      true,
      true
    )
    const onFocus = () => void throttledRefresh()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void throttledRefresh()
    }

    window.addEventListener('focus', onFocus)
    window.addEventListener('visibilitychange', onVisibilityChange)
    cleanupWindowFocus = () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('visibilitychange', onVisibilityChange)
      ;(throttledRefresh as CancellableFunction).cancel?.()
    }
  }

  if (refreshDeps?.length) {
    watch(
      () =>
        refreshDeps.map((dependency) =>
          isRef(dependency) ? dependency.value : dependency()
        ),
      () => {
        if (!manual) refresh()
      }
    )
  }

  const start = () => {
    nextTick(() => {
      if (disposed) return
      wrappedRun(...defaultParams)
      startPolling()
    })
  }

  if (!manual) {
    if (ready) {
      const readyRef = isRef(ready) ? ready : computed(ready)
      if (readyRef.value) {
        start()
      } else {
        const stopReady = watch(readyRef, (value) => {
          if (!value) return
          stopReady()
          start()
        })
      }
    } else {
      start()
    }
  }

  onScopeDispose(() => {
    disposed = true
    cancel()
    cleanupWindowFocus?.()
    cleanupWindowFocus = null
  })

  return {
    data,
    loading,
    error,
    run: wrappedRun,
    runAsync,
    refresh,
    refreshAsync,
    mutate,
    cancel,
  }
}
