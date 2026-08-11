<script setup lang="ts">
import ControlPreview from './controls/ControlPreview.vue'
import type { DesignerNode } from '../types'

defineProps<{
  node: DesignerNode
}>()
</script>

<template>
  <ControlPreview :node="node" />
</template>
