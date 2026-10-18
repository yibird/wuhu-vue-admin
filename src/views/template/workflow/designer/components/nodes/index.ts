import { markRaw } from 'vue'
import { workflowNodeDefinitions } from '../../../domain'
import BaseNode from './base-node.vue'
import type { Component } from 'vue'

/**
 * 节点类型 → 渲染组件映射
 *
 * 所有节点共用 BaseNode，新增节点定义后自动生效。
 * VueFlow 内部会把 nodeTypes 转为响应式对象，组件必须先 markRaw，
 * 否则会触发「Vue received a Component that was made a reactive object」警告。
 */
const RAW_BASE_NODE = markRaw(BaseNode)

export const workflowNodeTypes = markRaw(
  Object.fromEntries(
    workflowNodeDefinitions.map((definition) => [
      `workflow-${definition.kind}`,
      RAW_BASE_NODE,
    ])
  )
) as Record<string, Component>

export { default as BaseNode } from './base-node.vue'
