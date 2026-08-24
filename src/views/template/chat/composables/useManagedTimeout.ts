import { onScopeDispose } from 'vue'

export function useManagedTimeout() {
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const timersByKey = new Map<string, ReturnType<typeof setTimeout>>()

  function schedule(callback: () => void, delay: number, key?: string) {
    if (key) cancel(key)

    const timer = setTimeout(() => {
      timers.delete(timer)
      if (key && timersByKey.get(key) === timer) {
        timersByKey.delete(key)
      }
      callback()
    }, delay)
    timers.add(timer)
    if (key) timersByKey.set(key, timer)
    return timer
  }

  function cancel(key: string) {
    const timer = timersByKey.get(key)
    if (!timer) return
    clearTimeout(timer)
    timers.delete(timer)
    timersByKey.delete(key)
  }

  function clearAll() {
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()
    timersByKey.clear()
  }

  onScopeDispose(clearAll)

  return { cancel, clearAll, schedule }
}
