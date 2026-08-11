# Generate from tree data

## Description (en-US)

The tree structure can be populated using `treeData` property. This is a quick and easy way to provide the tree content.

## Source

```vue
<script setup lang="ts">
import type { TreeSelectEmits } from 'antdv-next'
import { ref } from 'vue'

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
]

const value = ref<string>()

const onChange: TreeSelectEmits['change'] = (newValue) => {
  console.log(newValue)
}
</script>

<template>
  <a-tree-select
    v-model:value="value"
    style="width: 100%"
    :styles="{
      popup: {
        root: {
          maxHeight: '400px',
          overflow: 'auto',
        },
      },
    }"
    :tree-data="treeData"
    placeholder="Please select"
    tree-default-expand-all
    @change="onChange"
  />
</template>
```
