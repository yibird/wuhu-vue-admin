import type { ToRef } from 'vue'

export function writableToRefs<T extends object>(obj: T) {
  const result: any = {}
  for (const key in obj) {
    result[key] = ref(obj)
  }
  return result as { [K in keyof T]: ToRef<T[K]> }
}
