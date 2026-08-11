# Multiple

## Description (en-US)

Select multiple options. Disable the `checkbox` by adding the `disableCheckbox` property and selecting a specific item. The style of the disable can be modified by the className.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'

interface Option {
  value: string | number
  label: string
  children?: Option[]
  disableCheckbox?: boolean
}

const options: Option[] = [
  {
    label: 'Light',
    value: 'light',
    children: Array.from({ length: 20 }).map((_, index) => ({
      label: `Number ${index}`,
      value: index,
    })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
            disableCheckbox: true,
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
]

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}
</script>

<template>
  <a-cascader
    style="width: 100%"
    :options="options"
    multiple
    max-tag-count="responsive"
    @change="onChange"
  />
</template>
```
