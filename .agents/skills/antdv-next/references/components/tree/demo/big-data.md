# Big data

## Description (en-US)

Plenty of tree nodes.

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode } from 'antdv-next'

const treeData: TreeDataNode[] = []

for (let i = 0; i < 100; i += 1) {
  const children: TreeDataNode[] = []

  for (let j = 0; j < 100; j += 1) {
    children.push({
      title: `child ${i}-${j}`,
      key: `l-${i}-${j}`,
    })
  }

  treeData.push({
    title: `parent ${i}`,
    key: `l-${i}`,
    children,
  })
}
</script>

<template>
  <a-tree default-expand-all :height="400" :tree-data="treeData" />
</template>
```
