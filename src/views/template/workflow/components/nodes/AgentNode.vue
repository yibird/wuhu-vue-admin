<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import type { WorkflowNodeData } from '../../types'
import BaseNode from './BaseNode.vue'

const props = defineProps<NodeProps<WorkflowNodeData>>()
</script>

<template>
  <BaseNode v-bind="props" kind-label="智能 Agent" />
</template>
