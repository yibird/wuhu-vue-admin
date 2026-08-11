# Custom dropdown

## Description (en-US)

Customize the dropdown menu via `popupRender`.

## Source

```vue
<script setup lang="ts">
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
</script>

<template>
  <a-cascader :options="options" placeholder="Please select">
    <template #popupRender="menus">
      <component :is="menus" />
      <a-divider style="margin: 0" />
      <div style="padding: 8px">
        The footer is not very short.
      </div>
    </template>
  </a-cascader>
</template>
```
