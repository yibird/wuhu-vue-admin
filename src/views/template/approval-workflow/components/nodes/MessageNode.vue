<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const detailItems = computed(() => [
  props.node.config.messageTemplate || '未配置消息模板',
  '站内 / 钉钉 / 邮件',
])
</script>

<template>
  <BaseNode
    :detail-items="detailItems"
    kind-label="消息通知"
    :node="node"
    :selected="selected"
    :summary-items="['模板消息', '多渠道触达']"
  />
</template>
