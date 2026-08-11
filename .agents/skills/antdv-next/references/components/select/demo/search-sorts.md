# Search with sort

## Description (en-US)

Search the options with sorting.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef<string>()

const options = [
  { value: '1', label: 'Not Identified' },
  { value: '2', label: 'Closed' },
  { value: '3', label: 'Communicated' },
  { value: '4', label: 'Identified' },
  { value: '5', label: 'Resolved' },
  { value: '6', label: 'Cancelled' },
]

function filterSort(optionA: { label?: string }, optionB: { label?: string }) {
  return (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
}
</script>

<template>
  <a-select
    v-model:value="value"
    show-search
    option-filter-prop="label"
    :filter-sort="filterSort"
    style="width: 200px"
    placeholder="Search to Select"
    :options="options"
  />
</template>
```
