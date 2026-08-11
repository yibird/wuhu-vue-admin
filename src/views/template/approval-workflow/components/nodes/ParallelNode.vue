<script setup lang="ts">
import { computed } from 'vue'
import BaseNode from './BaseNode.vue'
import { getBranchCount, multiModeText } from './nodeFormatters'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const summaryItems = computed(() => [
  '并行执行',
  multiModeText[props.node.config.assignee.multiMode],
  `${getBranchCount(props.node)} 条线`,
])
</script>

<template>
  <BaseNode
    :detail-items="['所有分支完成后汇合', '适合法务/财务并审']"
    kind-label="并行节点"
    :node="node"
    :selected="selected"
    :summary-items="summaryItems"
  />
</template>
