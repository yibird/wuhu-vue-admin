<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const summaryItems = computed(() => [
  `${props.node.config.formRequiredFields.length} 个必填字段`,
  props.node.config.fieldPermissions.some((field) => field.mode === 'hidden')
    ? '包含隐藏字段'
    : '字段可见',
])
</script>

<template>
  <BaseNode
    :detail-items="['发起权限校验', '重复提交与撤回策略']"
    kind-label="发起节点"
    :node="node"
    :selected="selected"
    :summary-items="summaryItems"
  />
</template>
