<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import { formatUsers } from './nodeFormatters'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const ccUserLabel = computed(() => formatUsers(props.node.config.ccUsers))
const summaryItems = computed(() => [
  '到达即通知',
  `${props.node.config.ccUsers.length} 人`,
])
</script>

<template>
  <BaseNode
    :detail-items="[ccUserLabel]"
    kind-label="抄送节点"
    :node="node"
    :selected="selected"
    :summary-items="summaryItems"
  />
</template>
