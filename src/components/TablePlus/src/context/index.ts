import type { TablePlusProvide } from '../types'

const contextKey = Symbol('context')
export function useTablePlusProvider<T extends Record<string, any>>(value: TablePlusProvide<T>) {
  provide(contextKey, value)
}

export function useTablePlusInject<T extends Record<string, any> = object>() {
  const context = inject(contextKey)
  if (!context) {
    return {} as TablePlusProvide<T>
  }
  return context as TablePlusProvide<T>
}
