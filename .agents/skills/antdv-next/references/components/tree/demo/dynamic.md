# load data asynchronously

## Description (en-US)

To load data asynchronously when click to expand a treeNode.

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode, TreeProps } from 'antdv-next'
import { ref } from 'vue'

type Key = string | number

const initTreeData: TreeDataNode[] = [
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
  { title: 'Tree Node', key: '2', isLeaf: true },
]

// It's just a simple demo. You can use tree map to optimize update perf.
function updateTreeData(list: TreeDataNode[], key: Key, children: TreeDataNode[]): TreeDataNode[] {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      }
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      }
    }
    return node
  })
}

const treeData = ref<TreeDataNode[]>(initTreeData)

const loadData: TreeProps['loadData'] = ({ key, children }) =>
  new Promise<void>((resolve) => {
    if (children) {
      resolve()
      return
    }
    setTimeout(() => {
      treeData.value = updateTreeData(treeData.value, key, [
        { title: 'Child Node', key: `${key}-0` },
        { title: 'Child Node', key: `${key}-1` },
      ])

      resolve()
    }, 1000)
  })
</script>

<template>
  <a-tree :load-data="loadData" :tree-data="treeData" />
</template>
```
