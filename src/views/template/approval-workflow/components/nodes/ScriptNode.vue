<script setup lang="ts">
import BaseNode from './BaseNode.vue'
import type { ApprovalNodeViewProps } from './types'

const props = defineProps<ApprovalNodeViewProps>()

const detailItems = computed(() => [
  props.node.config.script.trim().slice(0, 42) || '未配置脚本',
  '沙箱执行',
])
</script>

<template>
  <BaseNode
    :detail-items="detailItems"
    kind-label="脚本节点"
    :node="node"
    :selected="selected"
    :summary-items="['自定义逻辑', '返回审批上下文']"
  />
</template>
