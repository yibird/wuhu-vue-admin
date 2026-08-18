<template>
  <div class="h-full p-10 flex flex-col bg-white gap-10 overflow-hidden">
    <div class="flex justify-between items-center gap-10">
      <a-input allow-clear placeholder="请输入字典名称或编码">
        <template #prefix>
          <Icon name="i-lucide:search" />
        </template>
      </a-input>
      <a-button type="primary">
        <Icon name="i-lucide:plus" :size="20" />
      </a-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <a-tree
        v-if="data.length > 0"
        block-line
        :tree-data="data"
        :selected-keys="keys"
        :title-render="renderTitle"
        @select="onSelectedKeys"
      />
      <div v-else class="h-full flex-x-center py-100">
        <a-empty />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Dropdown from './Dropdown.vue'
import type { SiderProps, SiderEmits } from './types'

const { data = [], keys = [] } = defineProps<SiderProps>()
const emits = defineEmits<SiderEmits>()

import message from 'antdv-next/dist/message/index'

const renderTitle = (node: any) => {
  const label = h('div', { class: 'flex-1 truncate' }, node.title ?? node.label)
  const dropdown = h(Dropdown, {
    onDel() {
      message.success('删除成功')
    },
  })
  return h(
    'div',
    {
      class: 'py-6 flex justify-between items-center gap-10 overflow-hidden',
    },
    [label, dropdown]
  )
}
const onSelectedKeys = (keys: Array<string | number>) => {
  emits('change:keys', keys)
}
</script>
