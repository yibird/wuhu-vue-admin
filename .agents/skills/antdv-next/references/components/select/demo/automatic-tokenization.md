# Automatic tokenization

## Description (en-US)

Try to copy `Lucy,Jack` and paste to the input. Only available in tags and multiple mode.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const options = Array.from({ length: 26 }, (_, i) => {
  const value = (i + 10).toString(36) + (i + 10)
  return { value, label: value }
})

function handleChange(value: string[]) {
  console.log(`selected ${value}`)
}
const value = ref()
</script>

<template>
  <a-select
    v-model:value="value"
    mode="tags"
    style="width: 100%"
    :token-separators="[',']"
    :options="options"
    @change="handleChange"
  />
</template>
```
