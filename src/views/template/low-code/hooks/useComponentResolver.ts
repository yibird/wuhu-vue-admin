import { defineAsyncComponent, defineComponent, h } from 'vue'
import type { Component } from 'vue'
import { componentRegistry } from '../core/registry'

const asyncCache = new Map<string, Component>()

const MaterialError = defineComponent({
  name: 'LcMaterialError',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          class:
            'p-12 text-xs text-error border-1 border-error/40 border-solid rounded-6 bg-error/5',
        },
        '物料加载失败，请检查 Bundle 地址'
      )
  },
})

const MaterialLoading = defineComponent({
  name: 'LcMaterialLoading',
  inheritAttrs: false,
  setup() {
    return () =>
      h(
        'div',
        {
          class:
            'p-12 text-xs text-muted border-1 border-dashed border-color-2 border-solid rounded-6',
        },
        '物料加载中…'
      )
  },
})

/**
 * type -> Vue Component 解析：
 * 内置组件同步返回；远程物料通过 BundleLoader 懒加载并缓存。
 */
export function resolveComponentByType(type: string): Component | undefined {
  const item = componentRegistry.get(type)
  if (!item) return undefined
  if (item.component) return item.component
  const cached = asyncCache.get(type)
  if (cached) return cached
  const asyncComponent = defineAsyncComponent({
    loader: () => componentRegistry.resolveComponent(type),
    loadingComponent: MaterialLoading,
    errorComponent: MaterialError,
    delay: 120,
    timeout: 20000,
    onError: (error, retry, fail, attempts) => {
      if (attempts <= 1) {
        retry()
        return
      }
      console.warn(`[low-code] 物料加载失败: ${type}`, error)
      fail()
    },
  })
  asyncCache.set(type, asyncComponent)
  return asyncComponent
}

/** 物料重新注册后清理解析缓存 */
export function invalidateComponentCache(type?: string) {
  if (type) {
    asyncCache.delete(type)
  } else {
    asyncCache.clear()
  }
}
