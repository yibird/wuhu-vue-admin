# Panel

## Description (en-US)

Used for inline view case.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'
import { ref } from 'vue'

interface Option {
  value: string | number
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

const disabled = ref(false)

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}

const onMultipleChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <a-switch
      v-model:checked="disabled"
      checked-children="Enabled"
      un-checked-children="Disabled"
      aria-label="disabled switch"
    />
    <a-cascader-panel :options="options" :disabled="disabled" @change="onChange" />
    <a-cascader-panel multiple :options="options" :disabled="disabled" @change="onMultipleChange" />
    <a-cascader-panel />
  </a-flex>
</template>
```
