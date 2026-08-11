# Wheel

## Description (en-US)

Control with mouse wheel.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

function onChange(value: number) {
  console.log('changed', value)
}
const value = ref(3)
</script>

<template>
  <a-input-number
    v-model:value="value" :min="1" :max="10" change-on-wheel @change="onChange"
  />
</template>
```
