import { onScopeDispose } from 'vue'

export function useManagedTimeout() {
  const timers = new Set<ReturnType<typeof setTimeout>>()

  function schedule(callback: () => void, delay: number) {
    const timer = setTimeout(() => {
      timers.delete(timer)
      callback()
    }, delay)
    timers.add(timer)
    return timer
  }

  function clearAll() {
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()
  }

  onScopeDispose(clearAll)

  return { clearAll, schedule }
}
