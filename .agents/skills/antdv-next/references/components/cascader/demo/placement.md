# Placement

## Description (en-US)

You can manually specify the position of the popup via `placement`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

interface Option {
  value: string
  label: string
  children?: Option[]
}

const placement = shallowRef<Placement>('topLeft')

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <a-radio-group v-model:value="placement">
    <a-radio-button value="topLeft">
      topLeft
    </a-radio-button>
    <a-radio-button value="topRight">
      topRight
    </a-radio-button>
    <a-radio-button value="bottomLeft">
      bottomLeft
    </a-radio-button>
    <a-radio-button value="bottomRight">
      bottomRight
    </a-radio-button>
  </a-radio-group>
  <br>
  <br>
  <a-cascader :options="options" placeholder="Please select" :placement="placement" />
</template>
```
