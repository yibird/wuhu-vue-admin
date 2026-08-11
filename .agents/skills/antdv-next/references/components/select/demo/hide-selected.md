# Hide Already Selected

## Description (en-US)

Hide already selected options in the dropdown.

## Source

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']

const selectedItems = shallowRef<string[]>([])

const filteredOptions = computed(() =>
  OPTIONS.filter(o => !selectedItems.value.includes(o)).map(item => ({
    value: item,
    label: item,
  })),
)
</script>

<template>
  <a-select
    v-model:value="selectedItems"
    mode="multiple"
    placeholder="Inserted are removed"
    style="width: 100%"
    :options="filteredOptions"
  />
</template>
```
