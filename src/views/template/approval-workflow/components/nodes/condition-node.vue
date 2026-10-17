<template>
  <BaseNode
    :detail-items="detailItems"
    kind-label="条件分支"
    :node="node"
    :selected="selected"
    :summary-items="summaryItems"
  />
</template>

<script setup lang="ts">
import BaseNode from './base-node.vue'
import { getBranchCount, getBranchRuleCount } from './node-formatters'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const summaryItems = computed(() => [
  `${getBranchCount(props.node)} 条分支`,
  `${getBranchRuleCount(props.node)} 条规则`,
])

const detailItems = computed(() =>
  (props.node.branches ?? [])
    .slice(0, 2)
    .map((branch) => `${branch.title} · P${branch.priority}`)
)
</script>
