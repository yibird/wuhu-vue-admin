<script setup lang="ts">
import { computed } from 'vue'
import type { NodeProps } from '@vue-flow/core'
import type { WorkflowNodeData, WorkflowNodeKind } from '../../types'
import BaseNode from './BaseNode.vue'

const props = defineProps<NodeProps<WorkflowNodeData>>()

const kindLabels: Partial<Record<WorkflowNodeKind, string>> = {
  delay: '时间控制',
  approval: '人工协作',
  parallel: '并行编排',
  subflow: '流程复用',
  webhook: '事件集成',
}

const kindLabel = computed(() => kindLabels[props.data.kind] ?? '流程节点')
</script>

<template>
  <BaseNode v-bind="props" :kind-label="kindLabel" />
</template>
