# Basic

## Description (en-US)

Numeric-only input box.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <a-input-number v-model:value="value" :min="1" :max="10" />
</template>
```
