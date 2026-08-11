# Customize tooltip

## Description (en-US)

Use `tooltip.formatter` to format content of `Tooltip`. If `tooltip.formatter` is null, hide it.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
const value2 = ref(30)

function formatter(value: number) {
  return `${value}%`
}
</script>

<template>
  <a-slider v-model:value="value" :tooltip="{ formatter }" />
  <a-slider v-model:value="value2" :tooltip="{ formatter: null }" />
</template>
```
