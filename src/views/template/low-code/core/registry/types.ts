import type { Component } from 'vue'
import type { BundleSchema, ComponentDefinition } from '../schema/types'

/** 组件注册项：定义（元数据）与实现（Vue Component）分离 */
export interface RegisteredComponent {
  definition: ComponentDefinition
  component?: Component
  bundle?: BundleSchema
  status: 'ready' | 'loading' | 'error'
  error?: string
}

/** 内置物料：定义 + 实现（远程物料只有定义，实现由 bundle 懒加载） */
export interface MaterialEntry {
  definition: ComponentDefinition
  renderer?: Component
}
