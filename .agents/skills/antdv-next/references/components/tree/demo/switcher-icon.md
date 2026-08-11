# Customize collapse/expand icon

## Description (en-US)

customize collapse/expand icon of tree node

## Source

```vue
<script setup lang="ts">
import type { TreeDataNode, TreeEmits } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
          {
            title: 'leaf',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          {
            title: 'leaf',
            key: '0-0-2-0',
          },
          {
            title: 'leaf',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
]

const expandedKeys = ref(['0-0-0'])

const onSelect: TreeEmits['select'] = (selectedKeys, info) => {
  console.log('selected', selectedKeys, info)
}
</script>

<template>
  <a-tree
    v-model:expanded-keys="expandedKeys"
    show-line
    :tree-data="treeData"
    @select="onSelect"
  >
    <template #switcherIcon>
      <DownOutlined />
    </template>
  </a-tree>
</template>
```
