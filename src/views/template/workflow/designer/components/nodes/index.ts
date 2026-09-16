import { workflowNodeDefinitions } from '../../../domain'
import BaseNode from './BaseNode.vue'
import type { Component } from 'vue'

/**
 * 节点类型 → 渲染组件映射
 *
 * 所有节点共用 BaseNode，新增节点定义后自动生效。
 */
export const workflowNodeTypes = Object.fromEntries(
  workflowNodeDefinitions.map((definition) => [
    `workflow-${definition.kind}`,
    BaseNode,
  ])
) as Record<string, Component>

export { default as BaseNode } from './BaseNode.vue'
