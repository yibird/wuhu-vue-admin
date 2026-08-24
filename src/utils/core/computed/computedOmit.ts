type ComputedSource<T extends object> = Ref<T> | ComputedRef<T>
type ComputedOmit<T extends object, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: ComputedRef<T[P]>
}

export function computedOmit<
  T extends object,
  const K extends readonly (keyof T)[],
>(source: ComputedSource<T>, keys: K): ComputedOmit<T, K[number]> {
  const excluded = new Set<keyof T>(keys)
  return Object.fromEntries(
    (Object.keys(source.value) as (keyof T)[])
      .filter((key) => !excluded.has(key))
      .map((key) => [key, computed(() => source.value[key])])
  ) as ComputedOmit<T, K[number]>
}
