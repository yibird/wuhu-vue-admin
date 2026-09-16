import { ref } from 'vue'
import type { Component } from 'vue'
import { bundleLoader } from './bundle-loader'
import type { RegisteredComponent } from './types'
import type {
  BundleSchema,
  ComponentDefinition,
  MaterialSchema,
} from '../schema/types'

/** 注册表版本号：组件面板等 UI 依赖它感知物料注册/下架 */
export const registryVersion = ref(0)

function bumpRegistryVersion() {
  registryVersion.value += 1
}

/**
 * ComponentRegistry：ComponentSchema.type -> 实际组件实现的注册表。
 *
 * 职责：根据 type 找组件、加载组件、缓存组件、处理版本、提供给 Runtime 渲染。
 * 内置组件（component 直接提供）与远程物料（bundle 懒加载）使用同一套解析流程。
 */
export class ComponentRegistry {
  private readonly items = new Map<string, RegisteredComponent>()
  private readonly resolving = new Map<string, Promise<Component>>()

  register(
    definition: ComponentDefinition,
    options: { component?: Component; bundle?: BundleSchema } = {}
  ) {
    const component = options.component ?? definition.renderer
    const existing = this.items.get(definition.type)
    if (existing && existing.definition.version === definition.version) {
      // 同版本重复注册时仅补充缺失的实现
      if (!existing.component && component) {
        existing.component = component
        existing.status = 'ready'
      }
      return existing
    }
    const item: RegisteredComponent = {
      definition,
      component,
      bundle: options.bundle,
      status: component ? 'ready' : 'loading',
    }
    this.items.set(definition.type, item)
    bumpRegistryVersion()
    return item
  }

  registerMaterial(material: MaterialSchema, component?: Component) {
    return this.register(material.definition, {
      bundle: material.bundle,
      component,
    })
  }

  unregister(type: string) {
    this.items.delete(type)
    this.resolving.delete(type)
    bumpRegistryVersion()
  }

  has(type: string) {
    return this.items.has(type)
  }

  get(type: string): RegisteredComponent | undefined {
    return this.items.get(type)
  }

  getDefinition(type: string): ComponentDefinition | undefined {
    return this.items.get(type)?.definition
  }

  list(): RegisteredComponent[] {
    return [...this.items.values()]
  }

  /** 按分类聚拢组件，供组件面板展示 */
  listByCategory(): { category: string; items: RegisteredComponent[] }[] {
    const groups = new Map<string, RegisteredComponent[]>()
    for (const item of this.items.values()) {
      const list = groups.get(item.definition.category) ?? []
      list.push(item)
      groups.set(item.definition.category, list)
    }
    return [...groups.entries()].map(([category, items]) => ({
      category,
      items,
    }))
  }

  /**
   * 解析组件实现：
   * 内存缓存 -> BundleLoader 加载 -> 回写缓存。
   */
  resolveComponent(type: string): Promise<Component> {
    const item = this.items.get(type)
    if (!item) {
      return Promise.reject(new Error(`组件未注册: ${type}`))
    }
    if (item.component) return Promise.resolve(item.component)

    const resolving = this.resolving.get(type)
    if (resolving) return resolving

    if (!item.bundle) {
      item.status = 'error'
      item.error = `组件 ${type} 缺少实现且未声明 bundle`
      return Promise.reject(new Error(item.error))
    }

    item.status = 'loading'
    const promise = bundleLoader
      .load(item.bundle, type)
      .then((component) => {
        item.component = component
        item.status = 'ready'
        item.error = undefined
        this.resolving.delete(type)
        return component
      })
      .catch((error: unknown) => {
        item.status = 'error'
        item.error = error instanceof Error ? error.message : '物料加载失败'
        this.resolving.delete(type)
        throw error
      })

    this.resolving.set(type, promise)
    return promise
  }
}

export const componentRegistry = new ComponentRegistry()
