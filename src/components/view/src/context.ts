import type { ComputedRef, InjectionKey } from 'vue'
import type { ViewDirection, ViewSize } from './types'

export interface ViewContext {
  direction: ComputedRef<ViewDirection>
  gap: ComputedRef<string>
}

export const viewContextKey: InjectionKey<ViewContext> = Symbol('WViewContext')

/**
 * 将尺寸统一为 CSS 字符串:数字按像素处理,字符串原样返回
 * @param value 尺寸值
 * @returns CSS 尺寸
 */
export function toCssSize(value: ViewSize) {
  return typeof value === 'string' ? value : `${value}px`
}

export function getCssSize(value: string) {
  return value === '0px' ? value : `calc(0px - ${value})`
}
