<script setup lang="ts">
import { computed } from 'vue'
import AntdvControlPreview from './AntdvControlPreview.vue'
import BasicControlPreview from './BasicControlPreview.vue'
import type { DesignerComponentType, DesignerNode } from '../../types'

const props = defineProps<{
  node: DesignerNode
}>()

const basicTypes = new Set<DesignerComponentType>([
  'flex',
  'hero',
  'stats',
  'form',
  'table',
  'chart',
  'notice',
])

const isBasicNode = computed(() => basicTypes.has(props.node.type))
</script>

<template>
  <BasicControlPreview v-if="isBasicNode" :node="node" />
  <AntdvControlPreview v-else :node="node" />
</template>
