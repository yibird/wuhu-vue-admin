<script lang="ts" setup>
import { matchesOption } from '@/utils'
import type { DeptPickerProps, DeptPickerOption } from './types'

const props = withDefaults(defineProps<DeptPickerProps>(), {
  options: () => [],
  placeholder: '请选择部门',
  disabled: false,
  allowClear: true,
  loading: false,
  popupMatchSelectWidth: 320,
})

const model = defineModel<string | undefined>('value')

const treeClasses = {
  popup: {
    item: 'box-border min-h-32 pr-12',
    itemTitle: 'h-32 min-w-0 flex items-center overflow-hidden rounded-4',
    itemSwitcher: 'h-32 flex-center',
  },
}

function filterTreeNode(inputValue: string, treeNode: DeptPickerOption) {
  return matchesOption(inputValue, treeNode.title, treeNode.code)
}
</script>

<template>
  <a-tree-select
    v-model:value="model"
    class="w-full"
    :allow-clear="allowClear"
    :classes="treeClasses"
    :disabled="disabled"
    :filter-tree-node="filterTreeNode"
    :list-height="320"
    :loading="loading"
    :placeholder="placeholder"
    :popup-match-select-width="popupMatchSelectWidth"
    :show-search="{ treeNodeFilterProp: 'title' }"
    :size="size"
    :tree-data="options"
    tree-default-expand-all
    :tree-line="{ showLeafIcon: false }"
  >
    <template #prefix>
      <Icon name="i-lucide:building-2" class="text-secondary" :size="14" />
    </template>
  </a-tree-select>
</template>
