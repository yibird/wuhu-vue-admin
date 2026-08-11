# Basic

## Description (en-US)

The simplest usage.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(0)
</script>

<template>
  <a-rate v-model:value="value" />
</template>
```
