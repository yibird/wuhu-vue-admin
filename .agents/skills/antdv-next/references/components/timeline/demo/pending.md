# Pending

## Description (en-US)

Node supports `loading` to indicate loading, and `reverse` property to control the order of nodes.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const reverse = ref(false)

function handleClick() {
  reverse.value = !reverse.value
}

const items = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
  },
  {
    content: 'Technical testing 2015-09-01',
  },
  {
    loading: true,
    content: 'Recording...',
  },
]
</script>

<template>
  <a-flex vertical gap="middle" align="flex-start">
    <a-timeline :reverse="reverse" :items="items" />
    <a-button type="primary" @click="handleClick">
      Toggle Reverse
    </a-button>
  </a-flex>
</template>
```
