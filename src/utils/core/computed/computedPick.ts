import { computed, isRef, type ComputedRef, type MaybeRef } from 'vue'

type ComputedPick<T extends object, K extends keyof T> = {
  [P in K]: ComputedRef<T[P]>
}

export function computedPick<
  T extends object,
  const K extends readonly (keyof T)[],
>(source: MaybeRef<T>, keys: K): ComputedPick<T, K[number]> {
  return Object.fromEntries(
    keys.map((key) => [
      key,
      computed(() => {
        return isRef(source) ? source.value[key] : source[key]
      }),
    ])
  ) as ComputedPick<T, K[number]>
}
