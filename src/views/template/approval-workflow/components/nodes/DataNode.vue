<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const detailItems = computed(() => [
  props.node.config.webhookUrl || '未配置Webhook',
  '审批通过后执行',
])
</script>

<template>
  <BaseNode
    :detail-items="detailItems"
    kind-label="数据动作"
    :node="node"
    :selected="selected"
    :summary-items="['写入业务系统', '生成记录']"
  />
</template>
