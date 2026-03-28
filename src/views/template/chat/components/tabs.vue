<template>
  <div class="px-10 py-10 flex gap-10 border-b-1 border-solid border-[#E8E8E8]">
    <button
      v-for="(item, index) in items"
      :key="item.key"
      class="px-10 py-6 text-sm rounded-4 cursor-pointer transition-all"
      :class="[
        activeKey === item.key
          ? 'bg-primary/10 text-primary font-500'
          : 'text-regular hover:bg-[#f5f5f5]',
      ]"
      @click="onChange(item, index)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
<script lang="ts" setup>
import type { TabItem, TabsEmits, TabsProps } from './types'

const activeKey = defineModel('activeKey')
const { items = [] } = defineProps<TabsProps>()
const emits = defineEmits<TabsEmits>()
const onChange = (item: TabItem, index: number) => {
  activeKey.value = item.key
  emits('change', item, index)
}
</script>
