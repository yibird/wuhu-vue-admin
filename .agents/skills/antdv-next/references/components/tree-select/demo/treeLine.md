# Show Tree Line

## Description (en-US)

Use `treeLine` to show the line style.

## Source

```vue
<script setup lang="ts">
import { CarryOutOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    icon: h(CarryOutOutlined),
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        icon: h(CarryOutOutlined),
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
            icon: h(CarryOutOutlined),
          },
          {
            value: 'leaf2',
            title: 'leaf2',
            icon: h(CarryOutOutlined),
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        icon: h(CarryOutOutlined),
        children: [
          {
            value: 'sss',
            title: 'sss',
            icon: h(CarryOutOutlined),
          },
        ],
      },
    ],
  },
]

const treeLine = ref(true)
const showLeafIcon = ref(false)
const showIcon = ref(false)
</script>

<template>
  <a-space direction="vertical">
    <a-switch
      v-model:checked="showIcon"
      checked-children="showIcon"
      un-checked-children="showIcon"
    />
    <a-switch
      v-model:checked="treeLine"
      checked-children="treeLine"
      un-checked-children="treeLine"
    />
    <a-switch
      v-model:checked="showLeafIcon"
      :disabled="!treeLine"
      checked-children="showLeafIcon"
      un-checked-children="showLeafIcon"
    />
    <a-tree-select
      :tree-line="treeLine ? { showLeafIcon } : false"
      style="width: 300px"
      :tree-data="treeData"
      :tree-icon="showIcon"
    />
  </a-space>
</template>
```
