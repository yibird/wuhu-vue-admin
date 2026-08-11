# ShowCheckedStrategy

## Description (en-US)

Shows a selected item in a box using `showCheckedStrategy`.

## Source

```vue
<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'
import { Cascader } from 'antdv-next'
import { shallowRef } from 'vue'

const SHOW_CHILD = Cascader.SHOW_CHILD

interface Option {
  value: string | number
  label: string
  children?: Option[]
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
const value = shallowRef([
  ['bamboo', 'little', 'fish'],
  ['bamboo', 'little', 'cards'],
  ['bamboo', 'little', 'bird'],
] as any)

const value1 = shallowRef([['bamboo']])
</script>

<template>
  <a-cascader
    v-model:value="value"
    style="width: 100%"
    :options="options"
    multiple
    max-tag-count="responsive"
    :show-checked-strategy="SHOW_CHILD"
    @change="onChange"
  />
  <br>
  <br>
  <a-cascader
    v-model:value="value1"
    style="width: 100%"
    :options="options"
    multiple
    max-tag-count="responsive"
    @change="onChange"
  />
</template>
```
