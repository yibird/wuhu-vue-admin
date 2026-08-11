# Tags

## Description (en-US)

Allow user to select tags from list or input custom tag.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const options = Array.from({ length: 26 }, (_, i) => {
  const value = (i + 10).toString(36) + (i + 10)
  return { value, label: value }
})

const value = shallowRef<string[]>([])

function handleChange(val: string[]) {
  console.log(`selected ${val}`)
}
</script>

<template>
  <a-select
    v-model:value="value"
    mode="tags"
    style="width: 100%"
    placeholder="Tags Mode"
    :options="options"
    @change="handleChange"
  />
</template>
```
