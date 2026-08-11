<script setup lang="ts">
import { computed } from 'vue'
import type { NodeProps } from '@vue-flow/core'
import type { WorkflowNodeData, WorkflowNodeKind } from './types'
import BaseNode from './components/nodes/BaseNode.vue'

const props = defineProps<NodeProps<WorkflowNodeData>>()

const kindText: Record<WorkflowNodeKind, string> = {
  start: '输入触发',
  llm: '大模型',
  agent: '智能 Agent',
  knowledge: '知识召回',
  condition: '条件分支',
  code: '脚本处理',
  plugin: '插件工具',
  http: 'HTTP 请求',
  database: '数据访问',
  variable: '变量映射',
  loop: '循环迭代',
  delay: '时间控制',
  approval: '人工协作',
  parallel: '并行编排',
  subflow: '流程复用',
  webhook: '事件集成',
  message: '消息发送',
  end: '流程输出',
}

const kindLabel = computed(() => kindText[props.data.kind])
</script>

<template>
  <BaseNode v-bind="props" :kind-label="kindLabel" />
</template>
