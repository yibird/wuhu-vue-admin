import { tryOnMounted, tryOnScopeDispose } from '@vueuse/core'
import { readonly, shallowRef, type ShallowRef } from 'vue'

export type DeferredStrategy = 'idle' | 'animationFrame' | 'timeout'
export type DeferredTask = () => void | Promise<void>

export interface UseDeferredOptions {
  immediate?: boolean
  timeout?: number
  strategy?: DeferredStrategy
}

export interface UseDeferredReturn {
  isPending: Readonly<ShallowRef<boolean>>
  isRunning: Readonly<ShallowRef<boolean>>
  schedule: () => void
  cancel: () => void
  flush: () => Promise<void>
}

interface IdleDeadline {
  didTimeout: boolean
  timeRemaining: () => number
}

type IdleCallbackHandle = number
type IdleCallback = (deadline: IdleDeadline) => void

type WindowWithDeferredApi = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleCallback,
      options?: { timeout?: number }
    ) => IdleCallbackHandle
    cancelIdleCallback?: (handle: IdleCallbackHandle) => void
  }

function getWindow() {
  if (typeof window === 'undefined') return null
  return window as WindowWithDeferredApi
}

function createTimeoutScheduler(callback: DeferredTask, timeout: number) {
  const timer = window.setTimeout(() => void callback(), timeout)
  return () => window.clearTimeout(timer)
}

function createAnimationFrameScheduler(callback: DeferredTask) {
  const currentWindow = getWindow()
  if (!currentWindow) return undefined

  const frames: number[] = []
  frames[0] = currentWindow.requestAnimationFrame(() => {
    frames[1] = currentWindow.requestAnimationFrame(() => void callback())
  })

  return () => {
    frames.forEach((frame) => currentWindow.cancelAnimationFrame(frame))
  }
}

function createIdleScheduler(callback: DeferredTask, timeout: number) {
  const currentWindow = getWindow()
  if (!currentWindow) return undefined

  if (currentWindow.requestIdleCallback) {
    const handle = currentWindow.requestIdleCallback(() => void callback(), {
      timeout,
    })
    return () => currentWindow.cancelIdleCallback?.(handle)
  }

  return createAnimationFrameScheduler(callback)
}

function requestDeferredTask(
  callback: DeferredTask,
  options: Required<Pick<UseDeferredOptions, 'strategy' | 'timeout'>>
) {
  const currentWindow = getWindow()

  if (!currentWindow) {
    const timer = setTimeout(() => void callback(), 0)
    return () => clearTimeout(timer)
  }

  if (options.strategy === 'timeout') {
    return createTimeoutScheduler(callback, options.timeout)
  }

  if (options.strategy === 'animationFrame') {
    return createAnimationFrameScheduler(callback) ?? (() => {})
  }

  return createIdleScheduler(callback, options.timeout) ?? (() => {})
}

export function useDeferred(
  task: DeferredTask,
  options: UseDeferredOptions = {}
): UseDeferredReturn {
  const { immediate = true, timeout = 300, strategy = 'idle' } = options

  const isPending = shallowRef(false)
  const isRunning = shallowRef(false)
  let cancelTask: (() => void) | undefined

  const cancel = () => {
    cancelTask?.()
    cancelTask = undefined
    isPending.value = false
  }

  const runTask = async () => {
    cancelTask = undefined
    isPending.value = false
    isRunning.value = true
    try {
      await task()
    } finally {
      isRunning.value = false
    }
  }

  const schedule = () => {
    cancel()
    isPending.value = true
    cancelTask = requestDeferredTask(runTask, { strategy, timeout })
  }

  const flush = async () => {
    cancel()
    await runTask()
  }

  if (immediate) {
    tryOnMounted(schedule)
  }

  tryOnScopeDispose(cancel)

  return {
    isPending: readonly(isPending),
    isRunning: readonly(isRunning),
    schedule,
    cancel,
    flush,
  }
}
