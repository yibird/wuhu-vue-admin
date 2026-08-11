# Clickable

## Description (en-US)

Setting `onChange` makes Steps clickable.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const content = 'This is a content.'

const items = [
  {
    title: 'Step 1',
    content,
  },
  {
    title: 'Step 2',
    content,
  },
  {
    title: 'Step 3',
    content,
  },
]
const current = ref(0)
</script>

<template>
  <a-steps v-model:current="current" :items="items" />
  <a-divider />
  <a-steps v-model:current="current" :items="items" orientation="vertical" />
</template>
```
