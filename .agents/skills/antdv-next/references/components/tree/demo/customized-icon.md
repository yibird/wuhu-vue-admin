# Customize Icon

## Description (en-US)

You can customize icons for different nodes.

## Source

```vue
<script lang="ts" setup>
import type { TreeDataNode } from 'antdv-next'
import { DownOutlined, FrownFilled, FrownOutlined, MehOutlined, SmileOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: h(SmileOutlined),
    children: [
      {
        title: 'leaf',
        key: '0-0-0',
        icon: h(MehOutlined),
      },
      {
        title: 'leaf',
        key: '0-0-1',
        icon: ({ selected }: TreeDataNode) => (selected ? h(FrownFilled) : h(FrownOutlined)),
      },
    ],
  },
]
const selectedKeys = ref(['0-0-0'])
</script>

<template>
  <a-tree v-model:selected-keys="selectedKeys" show-icon default-expand-all :tree-data="treeData">
    <template #switcherIcon>
      <DownOutlined />
    </template>
  </a-tree>
</template>
```
