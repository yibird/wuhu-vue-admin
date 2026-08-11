# directory

## Description (en-US)

Built-in directory tree. `multiple` support `ctrl(Windows)` / `command(Mac)` selection.

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode, TreeEmits } from 'antdv-next'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
]

const onSelect: TreeEmits['select'] = (keys, info) => {
  console.log('Trigger Select', keys, info)
}

const onExpand: TreeEmits['expand'] = (keys, info) => {
  console.log('Trigger Expand', keys, info)
}
</script>

<template>
  <a-directory-tree
    multiple
    draggable
    default-expand-all
    :tree-data="treeData"
    @select="onSelect"
    @expand="onExpand"
  />
</template>
```
