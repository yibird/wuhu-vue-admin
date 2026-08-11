# Virtual scroll

## Description (en-US)

Use virtual list through `height` prop.

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode } from 'antdv-next'

function dig(path = '0', level = 3) {
  const list: TreeDataNode[] = []
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`
    const treeNode: TreeDataNode = {
      title: key,
      key,
    }

    if (level > 0) {
      treeNode.children = dig(key, level - 1)
    }

    list.push(treeNode)
  }
  return list
}

const treeData = dig()
</script>

<template>
  <a-tree
    :tree-data="treeData"
    :height="233"
    default-expand-all
  >
    <template #titleRender="{ title }">
      <a-tooltip :title="title as any">
        {{ title }}
      </a-tooltip>
    </template>
  </a-tree>
</template>
```
