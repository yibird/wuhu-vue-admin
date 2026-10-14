<script setup lang="ts">
import BaseNode from './base-node.vue'
import { formatUsers } from './node-formatters'
import type { ApprovalNodeViewProps } from './types'

defineOptions({ name: 'CcNode' })

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
