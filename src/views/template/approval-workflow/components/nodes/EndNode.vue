<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const summaryItems = computed(() => [
  props.node.required ? '固定节点' : '可配置',
  '归档记录',
])
</script>

<template>
  <BaseNode
    :detail-items="['操作日志归档', '电子签名与水印留痕']"
    kind-label="结束节点"
    :node="node"
    :selected="selected"
    :summary-items="summaryItems"
  />
</template>
