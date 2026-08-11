# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits, CascaderProps } from 'antdv-next'

interface Option {
  value: string
  label: string
  children?: Option[]
}

const options: Option[] = [
  {
    value: 'meet-student',
    label: 'meet-student',
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

const classes: CascaderProps['classes'] = {
  root: 'cascader-demo-root',
}

const stylesObject: CascaderProps['styles'] = {
  prefix: {
    color: '#ccc',
  },
  suffix: {
    color: '#ccc',
  },
}

const stylesFn: CascaderProps['styles'] = ({ props }) => {
  if (props.variant === 'filled') {
    return {
      prefix: {
        color: '#1890ff',
      },
      suffix: {
        color: '#1890ff',
      },
      popup: {
        listItem: {
          color: '#1890ff',
        },
      },
    }
  }
  return {}
}

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-cascader
      :options="options"
      :classes="classes"
      :styles="stylesObject"
      placeholder="Object styles"
      prefix="🏠"
      @change="onChange"
    />
    <a-cascader
      :options="options"
      :classes="classes"
      :styles="stylesFn"
      placeholder="Function styles"
      variant="filled"
      prefix="✅"
      @change="onChange"
    />
  </a-flex>
</template>

<style scoped>
:deep(.cascader-demo-root) {
  border-radius: 8px;
  width: 300px;
}
</style>
```
