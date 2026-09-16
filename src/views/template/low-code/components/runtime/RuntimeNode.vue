<template>
  <component
    :is="binding.component.value"
    v-if="binding.visible.value"
    v-bind="binding.resolvedProps.value"
    :disabled="binding.disabled.value || undefined"
    v-on="binding.listeners.value"
  >
    <template v-if="binding.acceptsChildren.value" #[binding.slotName.value]>
      <RuntimeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :parent-layout="binding.layout.value"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useNodeBinding } from '../../composables/useNodeBinding'
import type { ComponentSchema, LayoutMode } from '../../core/schema/types'

const props = withDefaults(
  defineProps<{
    node: ComponentSchema
    parentLayout?: LayoutMode
  }>(),
  {
    parentLayout: 'block',
  }
)

const binding = useNodeBinding(
  props.node,
  toRef(props, 'parentLayout'),
  'runtime'
)
</script>
