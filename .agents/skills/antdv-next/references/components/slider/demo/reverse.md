# Reverse

## Description (en-US)

Using `reverse` to render slider reversely.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const reverse = ref(true)
const value = ref(30)
const valueRange = ref([20, 50])
</script>

<template>
  <a-slider v-model:value="value" :reverse="reverse" />
  <a-slider v-model:value="valueRange" range :reverse="reverse" />
  Reversed: <a-switch v-model:checked="reverse" size="small" />
</template>
```
