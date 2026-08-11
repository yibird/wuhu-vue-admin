# Option Group

## Description (en-US)

Using `OptGroup` to group the options.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef('Lucy')

const options = [
  {
    label: 'manager',
    title: 'manager',
    options: [
      { label: 'Jack', value: 'Jack' },
      { label: 'Lucy', value: 'Lucy' },
    ],
  },
  {
    label: 'engineer',
    title: 'engineer',
    options: [
      { label: 'Chloe', value: 'Chloe' },
      { label: 'Lucas', value: 'Lucas' },
    ],
  },
]

function handleChange(val: string) {
  console.log(`selected ${val}`)
}
</script>

<template>
  <a-select
    v-model:value="value"
    style="width: 200px"
    :options="options"
    @change="handleChange"
  />
</template>

<style scoped>

</style>
```
