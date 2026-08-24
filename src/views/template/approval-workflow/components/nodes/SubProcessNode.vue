<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const detailItems = computed(() => [
  props.node.config.subProcessId || '未绑定子流程',
  '继承当前审批上下文',
])
</script>

<template>
  <BaseNode
    :detail-items="detailItems"
    kind-label="子流程"
    :node="node"
    :selected="selected"
    :summary-items="['复用流程', '上下文传递']"
  />
</template>
