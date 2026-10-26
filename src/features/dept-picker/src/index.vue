<template>
  <a-tree-select
    v-model:value="selectValue"
    class="w-full"
    :allow-clear="allowClear"
    :classes="treeClasses"
    :disabled="disabled"
    :filter-tree-node="filterTreeNode"
    @dropdown-visible-change="preloadPinyinMatch"
    :list-height="320"
    :loading="loading"
    :placeholder="placeholder"
    :popup-match-select-width="popupMatchSelectWidth"
    :show-search="{ treeNodeFilterProp: 'title' }"
    :size="size"
    :tree-data="treeData"
    tree-default-expand-all
    tree-node-label-prop="label"
    :tree-line="{ showLeafIcon: false }"
  >
    <template #treeTitleRender="node">
      <span class="flex items-center gap-6">
        <Icon name="i-lucide:building-2" class="text-secondary" :size="14" />
        <span class="truncate">{{ node.title }}</span>
      </span>
    </template>
  </a-tree-select>
</template>

<script lang="ts" setup>
import { h, type VNode } from 'vue'
import { Icon } from '@/components/icon'
import { loadPinyinMatch, matchesOption } from '@/utils'
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

/** 空字符串会让 TreeSelect 进入 has-value 状态,统一转换为 undefined 以显示 placeholder */
const selectValue = computed({
  get: () => model.value || undefined,
  set: (value: string | undefined) => {
    model.value = value || undefined
  },
})

const treeClasses = {
  // 树选择器空值时 content 只有输入框高度,与普通 select 的 32px 高度不一致
  content: 'min-h-22',
  popup: {
    item: 'box-border min-h-32 pr-12',
    itemTitle: 'h-32 min-w-0 flex items-center overflow-hidden rounded-4',
    itemSwitcher: 'h-32 flex-center',
  },
}

interface DeptPickerTreeNode extends DeptPickerOption {
  /**
   * 选中后展示在输入框中的节点内容
   */
  label: VNode
}

function renderDeptLabel(title: string) {
  return h('span', { class: 'flex items-center gap-6' }, [
    h(Icon, { name: 'i-lucide:building-2', class: 'text-secondary', size: 14 }),
    h('span', { class: 'truncate' }, title),
  ])
}

function withNodeLabels(options: DeptPickerOption[]): DeptPickerTreeNode[] {
  return options.map((option) => ({
    ...option,
    label: renderDeptLabel(option.title),
    children: option.children ? withNodeLabels(option.children) : undefined,
  }))
}

const treeData = computed(() => withNodeLabels(props.options))

function filterTreeNode(inputValue: string, treeNode: DeptPickerOption) {
  return matchesOption(inputValue, treeNode.title, treeNode.code)
}

/** 展开下拉即预热拼音匹配库,过滤是同步回调,首个关键词不该漏掉拼音命中 */
function preloadPinyinMatch() {
  void loadPinyinMatch()
}
</script>
