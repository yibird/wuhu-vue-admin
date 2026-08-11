# Prefix and Suffix

## Description (en-US)

Use `prefix` to customize the prefix content, use `suffixIcon` to customize the selection box suffix icon, and use `expandIcon` to customize the current item expand icon.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'
import { SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

interface Option {
  value: string
  label: string
  children?: Option[]
}

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

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}

const prefixIcon = h(SmileOutlined)
</script>

<template>
  <a-cascader
    :options="options"
    placeholder="Please select"
    @change="onChange"
  >
    <template #suffixIcon>
      <SmileOutlined />
    </template>
  </a-cascader>
  <br>
  <br>
  <a-cascader
    suffix-icon="ab"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
  <br>
  <br>
  <a-cascader
    :options="options"
    placeholder="Please select"
    @change="onChange"
  >
    <template #expandIcon>
      <SmileOutlined />
    </template>
  </a-cascader>
  <br>
  <br>
  <a-cascader
    expand-icon="ab"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
  <br>
  <br>
  <a-cascader
    :prefix="prefixIcon"
    :options="options"
    placeholder="Please select"
    @change="onChange"
  />
</template>
```
