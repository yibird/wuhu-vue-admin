# Dynamic edit nodes

## Description (en-US)

Click to add a node, drag out or press the key to delete the node.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref([20, 80])
</script>

<template>
  <a-slider
    v-model:value="value"
    :range="{ editable: true, minCount: 1, maxCount: 5 }"
  />
</template>
```
