import type { ComputedRef, InjectionKey } from 'vue'
import type { ViewDirection, ViewSize } from './types'

export interface ViewContext {
  direction: ComputedRef<ViewDirection>
  gap: ComputedRef<string>
}

export const viewContextKey: InjectionKey<ViewContext> = Symbol('ViewContext')

export function toCssSize(value: ViewSize) {
  return typeof value === 'string' ? value : `${value}px`
}

export function getCssSize(value: string) {
  return value === '0px' ? value : `calc(0px - ${value})`
}
