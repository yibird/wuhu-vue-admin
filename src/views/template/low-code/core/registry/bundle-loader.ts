import type { Component } from 'vue'
import type { BundleSchema } from '../schema/types'

type Resolver = (component: Component) => void

interface PendingMaterial {
  resolve: Resolver
  reject: (error: Error) => void
  timer: number
}

/** 物料运行时桥：global 格式的 bundle 通过它注册组件实现 */
export interface MaterialRuntimeBridge {
  vue: Record<string, unknown>
  register: (type: string, component: Component) => void
  pending: Map<string, PendingMaterial>
}

const BRIDGE_KEY = '__WUHU_LOW_CODE__'

function getBridge(): MaterialRuntimeBridge | undefined {
  return (window as unknown as Record<string, unknown>)[BRIDGE_KEY] as
    | MaterialRuntimeBridge
    | undefined
}

/**
 * 安装物料运行时桥（幂等）。
 * global 格式的 bundle 约定：
 *   const { defineComponent, h } = window.__WUHU_LOW_CODE__.vue
 *   window.__WUHU_LOW_CODE__.register('WeatherCard', defineComponent({ ... }))
 */
export function installMaterialRuntimeBridge() {
  if (getBridge()) return
  const bridge: MaterialRuntimeBridge = {
    vue: {},
    pending: new Map(),
    register(type, component) {
      const pending = bridge.pending.get(type)
      if (pending) {
        window.clearTimeout(pending.timer)
        bridge.pending.delete(type)
        pending.resolve(component)
      }
    },
  }
  ;(window as unknown as Record<string, unknown>)[BRIDGE_KEY] = bridge
}

/** 暴露给 bundle 的 Vue 能力（最小集合） */
export function provideMaterialVueApi(api: Record<string, unknown>) {
  installMaterialRuntimeBridge()
  const bridge = getBridge()
  if (bridge) Object.assign(bridge.vue, api)
}

async function verifyIntegrity(content: string, integrity: string) {
  if (!('crypto' in window) || !window.crypto.subtle) return
  const [algorithm, expected] = integrity.split('-')
  if (!algorithm || !expected) return
  const buffer = await window.crypto.subtle.digest(
    algorithm.toUpperCase().replace('SHA', 'SHA-'),
    new TextEncoder().encode(content)
  )
  const actual = Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  if (actual !== expected) {
    throw new Error(`物料完整性校验失败: ${integrity}`)
  }
}

/**
 * BundleLoader：下载 Bundle / ESM 加载 / CSS 加载 / integrity 校验 / 缓存。
 */
export class BundleLoader {
  private readonly cache = new Map<string, Promise<Component>>()
  private readonly styles = new Set<string>()

  load(bundle: BundleSchema, type: string): Promise<Component> {
    const cacheKey = `${bundle.url}#${type}`
    const cached = this.cache.get(cacheKey)
    if (cached) return cached
    const promise =
      bundle.format === 'global'
        ? this.loadGlobal(bundle, type)
        : this.loadEsm(bundle, type)
    this.cache.set(cacheKey, promise)
    this.injectStyles(bundle)
    promise.catch(() => this.cache.delete(cacheKey))
    return promise
  }

  private async loadEsm(bundle: BundleSchema, type: string) {
    const module = bundle.integrity
      ? await this.importVerified(bundle)
      : await import(/* @vite-ignore */ bundle.url)
    const candidate =
      (module?.default as Component | undefined) ??
      (module?.[type] as Component | undefined) ??
      (module as Component)
    if (!candidate) {
      throw new Error(`Bundle 未导出可用组件: ${bundle.url}`)
    }
    return candidate
  }

  private async importVerified(bundle: BundleSchema) {
    const response = await fetch(bundle.url)
    if (!response.ok) {
      throw new Error(`Bundle 下载失败: ${response.status}`)
    }
    const content = await response.text()
    await verifyIntegrity(content, bundle.integrity as string)
    const blob = new Blob([content], { type: 'text/javascript' })
    const blobUrl = URL.createObjectURL(blob)
    try {
      return await import(/* @vite-ignore */ blobUrl)
    } finally {
      URL.revokeObjectURL(blobUrl)
    }
  }

  private loadGlobal(bundle: BundleSchema, type: string): Promise<Component> {
    installMaterialRuntimeBridge()
    const bridge = getBridge()
    if (!bridge) return Promise.reject(new Error('物料运行时桥未安装'))

    return new Promise<Component>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        bridge.pending.delete(type)
        reject(new Error(`物料加载超时: ${type}`))
      }, 15000)
      bridge.pending.set(type, { resolve, reject, timer })

      const script = document.createElement('script')
      script.src = bundle.url
      script.async = true
      script.onerror = () => {
        window.clearTimeout(timer)
        bridge.pending.delete(type)
        reject(new Error(`Bundle 加载失败: ${bundle.url}`))
      }
      document.head.appendChild(script)
    })
  }

  private async injectStyles(bundle: BundleSchema) {
    for (const url of bundle.styles ?? []) {
      if (this.styles.has(url)) continue
      this.styles.add(url)
      await new Promise<void>((resolve) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        link.onload = () => resolve()
        link.onerror = () => resolve()
        document.head.appendChild(link)
      })
    }
  }
}

export const bundleLoader = new BundleLoader()
