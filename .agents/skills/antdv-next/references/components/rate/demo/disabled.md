# Read only

## Description (en-US)

Read only, can't use mouse to interact.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(2)
</script>

<template>
  <a-rate v-model:value="value" disabled />
</template>
```
