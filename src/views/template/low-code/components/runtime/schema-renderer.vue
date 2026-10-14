<template>
  <RuntimeProvider :runtime="runtime">
    <RuntimeNode
      v-for="child in components"
      :key="child.id"
      :node="child"
      parent-layout="block"
    />
  </RuntimeProvider>
</template>

<script setup lang="ts">
import RuntimeNode from './runtime-node.vue'
import RuntimeProvider from './runtime-provider.vue'
import type { RuntimeApi } from '../../core/runtime'
import type { ComponentSchema } from '../../core/schema/types'

defineOptions({ name: 'SchemaRenderer' })

defineProps<{
  runtime: RuntimeApi
  components: ComponentSchema[]
}>()
</script>
