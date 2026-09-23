<template>
  <div
    v-if="binding.visible.value"
    class="lc-runtime-node"
    :style="binding.style.value"
  >
    <component
      :is="binding.component.value"
      v-if="binding.component.value"
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
          :parent-direction="binding.direction.value"
        />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { useNodeBinding } from '../../hooks/useNodeBinding'
import type { ComponentSchema, LayoutMode } from '../../core/schema/types'

const props = withDefaults(
  defineProps<{
    node: ComponentSchema
    parentLayout?: LayoutMode
    parentDirection?: 'row' | 'column'
  }>(),
  {
    parentLayout: 'block',
    parentDirection: undefined,
  }
)

const binding = useNodeBinding(
  props.node,
  toRef(props, 'parentLayout'),
  'runtime',
  toRef(props, 'parentDirection')
)
</script>

<style scoped lang="less">
/**
 * 与设计画布一致：节点样式由包装层承载。
 * 纯布局容器（Block/Flex/Grid）自身不产生 DOM，没有包装层时其 flex/grid、间距与
 * 断点样式会在运行时被丢弃，因此 Runtime 同样需要一个承载样式的包装元素。
 */
.lc-runtime-node {
  box-sizing: border-box;
  min-width: 0;
}
</style>
