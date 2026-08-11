<script setup lang="ts">
import { computed } from 'vue'
import BaseNode from './BaseNode.vue'
import {
  assigneeModeText,
  formatActionCount,
  formatTimeout,
  formatUsers,
  multiModeText,
} from './nodeFormatters'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const summaryItems = computed(() => [
  assigneeModeText[props.node.config.assignee.mode],
  multiModeText[props.node.config.assignee.multiMode],
  formatTimeout(props.node),
])

const detailItems = computed(() => [
  formatUsers(props.node.config.assignee.users),
  formatActionCount(props.node),
])
</script>

<template>
  <BaseNode
    :detail-items="detailItems"
    kind-label="审批节点"
    :node="node"
    :selected="selected"
    :summary-items="summaryItems"
  />
</template>
