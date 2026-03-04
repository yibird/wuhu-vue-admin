<template>
  <div class="h-full p-10 flex flex-col bg-white gap-10 overflow-hidden">
    <div class="flex justify-between items-center gap-10">
      <n-input clearable placeholder="请输入字典名称或编码">
        <template #prefix>
          <Icon name="i-lucide:search" />
        </template>
      </n-input>
      <n-button type="primary">
        <Icon name="i-lucide:plus" :size="20" />
      </n-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <n-tree
        v-if="data.length > 0"
        block-line
        :data="data"
        :selected-keys="keys"
        :render-label="renderLabel"
        @update-selected-keys="onSelectedKeys"
      />
      <div v-else class="h-full flex-x-center py-100">
        <n-empty />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Dropdown from './Dropdown.vue'
import { useMessage, type TreeOption } from 'naive-ui'
import type { SiderProps, SiderEmits } from './types'

const { data = [], keys = [] } = defineProps<SiderProps>()
const emits = defineEmits<SiderEmits>()

const message = useMessage()

const renderLabel = ({ option }: { option: TreeOption }) => {
  const label = h('div', { class: 'flex-1 truncate' }, option.label)
  const dropdown = h(Dropdown, {
    onDel() {
      message.success('删除成功')
    }
  })
  return h(
    'div',
    {
      class: 'py-6 flex justify-between items-center gap-10 overflow-hidden'
    },
    [label, dropdown]
  )
}
const onSelectedKeys = (keys: Array<string | number>) => {
  emits('change:keys', keys)
}
</script>
