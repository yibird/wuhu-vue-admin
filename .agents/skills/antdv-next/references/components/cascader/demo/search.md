# Search

## Description (en-US)

Search and select options directly.

> Now, `Cascader[showSearch]` doesn't support search on server, more info [#5547](https://github.com/ant-design/ant-design/issues/5547)

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'

interface Option {
  value: string
  label: string
  children?: Option[]
  disabled?: boolean
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
          {
            value: 'xiasha',
            label: 'Xia Sha',
            disabled: true,
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
            label: 'Zhong Hua men',
          },
        ],
      },
    ],
  },
]

const onChange: CascaderEmits['change'] = (value, selectedOptions) => {
  console.log(value, selectedOptions)
}

function handleSearch(value: string) {
  console.log(value)
}

function filter(inputValue: string, path: Option[]) {
  return path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()))
}
</script>

<template>
  <a-cascader
    :options="options"
    :show-search="{ filter, onSearch: handleSearch } as any"
    placeholder="Please select"
    @change="onChange"
  />
</template>
```
