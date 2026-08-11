# Multiple selection

## Description (en-US)

Multiple selection, selecting from existing items.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const options = Array.from({ length: 26 }, (_, i) => {
  const value = (i + 10).toString(36) + (i + 10)
  return { label: value, value }
})

const value1 = shallowRef(['a10', 'c12'])
const value2 = shallowRef(['a10', 'c12'])

function handleChange(value: string[]) {
  console.log(`selected ${value}`)
}
</script>

<template>
  <a-space style="width: 100%" vertical>
    <a-select
      v-model:value="value1"
      mode="multiple"
      allow-clear
      style="width: 100%"
      placeholder="Please select"
      :options="options"
      @change="handleChange"
    />
    <a-select
      v-model:value="value2"
      mode="multiple"
      disabled
      style="width: 100%"
      placeholder="Please select"
      :options="options"
      @change="handleChange"
    />
  </a-space>
</template>
```
