# Basic

## Description (en-US)

The most basic usage.

## Source

```vue
<script setup lang="ts">
import type { TreeSelectEmits } from 'antdv-next'
import { ref } from 'vue'

const value = ref()
const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
          },
          {
            value: 'leaf2',
            title: 'leaf2',
          },
          {
            value: 'leaf3',
            title: 'leaf3',
          },
          {
            value: 'leaf4',
            title: 'leaf4',
          },
          {
            value: 'leaf5',
            title: 'leaf5',
          },
          {
            value: 'leaf6',
            title: 'leaf6',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'leaf11',
            title: 'leaf11',
          },
        ],
      },
    ],
  },
]

const onPopupScroll: TreeSelectEmits['popupScroll'] = (e) => {
  console.log('onPopupScroll', e)
}
</script>

<template>
  <a-tree-select
    v-model:value="value"
    :tree-data="treeData"
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
    allow-clear
    tree-default-expand-all
    @popup-scroll="onPopupScroll"
  >
    <template #treeTitleRender="item">
      <template v-if="item.value === 'leaf11'">
        <b style="color: #08c">leaf11</b>
      </template>
    </template>
  </a-tree-select>
  {{ value }}
</template>
```
