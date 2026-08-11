# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { TreeSelectProps } from 'antdv-next'

const classes: TreeSelectProps['classes'] = {
  root: 'custom-tree-select',
}

const stylesObject: TreeSelectProps['styles'] = {
  input: {
    fontSize: 16,
  },
  suffix: {
    color: '#1890ff',
  },
  popup: {
    root: {
      border: '1px solid #1890ff',
    },
  },
}

const stylesFn: TreeSelectProps['styles'] = (info) => {
  if (info.props.size === 'middle') {
    return {
      suffix: {
        color: '#722ed1',
      },
      popup: {
        item: {
          color: '#722ed1',
        },
      },
    }
  }
  return {}
}

const treeData: TreeSelectProps['treeData'] = [
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
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'leaf3',
            title: 'leaf3',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <a-flex vertical gap="large">
    <a-tree-select
      :tree-data="treeData"
      :classes="classes"
      :styles="stylesObject"
      placeholder="Object"
    />
    <a-tree-select
      :tree-data="treeData"
      :classes="classes"
      :styles="stylesFn"
      placeholder="Function"
      size="middle"
    />
  </a-flex>
</template>

<style>
.custom-tree-select {
  width: 300px;
  border-radius: 6px;
}
</style>
```
