# Asynchronous loading

## Description (en-US)

Asynchronous loading tree node.

## Source

```vue
<script setup lang="ts">
import type { TreeSelectEmits, TreeSelectProps } from 'antdv-next'
import { ref } from 'vue'

type TreeDataItem = NonNullable<TreeSelectProps['treeData']>[number]

const value = ref<string>()
const treeData = ref<TreeDataItem[]>([
  { id: 1, pId: 0, value: '1', title: 'Expand to load' },
  { id: 2, pId: 0, value: '2', title: 'Expand to load' },
  { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
])

function genTreeNode(parentId: string | number, isLeaf = false): TreeDataItem {
  const random = Math.random().toString(36).substring(2, 6)
  return {
    id: random,
    pId: parentId,
    value: random,
    title: isLeaf ? 'Tree Node' : 'Expand to load',
    isLeaf,
  }
}

const onLoadData: TreeSelectProps['loadData'] = ({ id }) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      const parentId = id ?? 0
      treeData.value = treeData.value.concat([
        genTreeNode(parentId, false),
        genTreeNode(parentId, true),
        genTreeNode(parentId, true),
      ])
      resolve()
    }, 300)
  })

const onChange: TreeSelectEmits['change'] = (newValue) => {
  console.log(newValue)
}
</script>

<template>
  <a-tree-select
    v-model:value="value"
    tree-data-simple-mode
    style="width: 100%"
    :styles="{
      popup: {
        root: {
          maxHeight: '400px',
          overflow: 'auto',
        },
      },
    }"
    placeholder="Please select"
    :load-data="onLoadData"
    :tree-data="treeData"
    @change="onChange"
  />
</template>
```
