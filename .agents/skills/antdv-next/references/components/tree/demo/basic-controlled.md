# Controlled Tree

## Description (en-US)

Controlled mode lets parent nodes reflect the status of child nodes more intelligently.

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode, TreeEmits } from 'antdv-next'
import { ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
]

const expandedKeys = ref<(string | number)[]>(['0-0-0', '0-0-1'])
const checkedKeys = ref<(string | number)[]>(['0-0-0'])
const selectedKeys = ref<(string | number)[]>([])
const autoExpandParent = ref(true)

const onExpand: TreeEmits['expand'] = (expandedKeysValue) => {
  console.log('onExpand', expandedKeysValue)
  // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  // or, you can remove all expanded children keys.
  expandedKeys.value = expandedKeysValue
  autoExpandParent.value = false
}

const onCheck: TreeEmits['check'] = (checkedKeysValue) => {
  console.log('onCheck', checkedKeysValue)
  checkedKeys.value = checkedKeysValue as (string | number)[]
}

const onSelect: TreeEmits['select'] = (selectedKeysValue, info) => {
  console.log('onSelect', info)
  selectedKeys.value = selectedKeysValue
}
</script>

<template>
  <a-tree
    checkable
    :expanded-keys="expandedKeys"
    :auto-expand-parent="autoExpandParent"
    :checked-keys="checkedKeys"
    :selected-keys="selectedKeys"
    :tree-data="treeData"
    @expand="onExpand"
    @check="onCheck"
    @select="onSelect"
  />
</template>
```
