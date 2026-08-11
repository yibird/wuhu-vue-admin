# Checkable

## Description (en-US)

Multiple and checkable.

## Source

```vue
<script setup lang="ts">
import { TreeSelect } from 'antdv-next'
import { ref } from 'vue'

const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
]

const value = ref<string[]>(['0-0-0'])

function onChange(newValue: string[]) {
  console.log('onChange', newValue)
}
</script>

<template>
  <a-tree-select
    v-model:value="value"
    :tree-data="treeData"
    tree-checkable
    :show-checked-strategy="SHOW_PARENT"
    placeholder="Please select"
    style="width: 100%"
    @change="onChange"
  />
</template>
```
