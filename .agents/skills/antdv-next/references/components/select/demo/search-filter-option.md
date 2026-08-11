# Custom Search

## Description (en-US)

Customize search using `filterOption`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef<string>()

const options = [
  { value: '1', label: 'Jack' },
  { value: '2', label: 'Lucy' },
  { value: '3', label: 'Tom' },
]

function filterOption(input: string, option: { label?: string }) {
  return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
}
</script>

<template>
  <a-select
    v-model:value="value"
    show-search
    :filter-option="filterOption"
    placeholder="Select a person"
    :options="options"
  />
</template>
```
