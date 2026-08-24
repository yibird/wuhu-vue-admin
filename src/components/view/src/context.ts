import type { ComputedRef, InjectionKey } from 'vue'
import type { ViewDirection } from './types'

export interface ViewContext {
  direction: ComputedRef<ViewDirection>
  gap: ComputedRef<string>
}

export const viewContextKey: InjectionKey<ViewContext> = Symbol('WViewContext')

export function getCssSize(value: string) {
  return value === '0px' ? value : `calc(0px - ${value})`
}
