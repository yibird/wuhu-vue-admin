# Horizontal

## Description (en-US)

Horizontal layout.

## Source

```vue
<script setup lang="ts">
const items = [
  {
    content: 'Init',
  },
  {
    content: 'Start',
  },
  {
    content: 'Pending',
  },
  {
    content: 'Complete',
  },
]
</script>

<template>
  <a-flex vertical>
    <a-timeline mode="start" orientation="horizontal" :items="items" />
    <a-divider />
    <a-timeline mode="right" orientation="horizontal" :items="items" />
    <a-divider />
    <a-timeline mode="alternate" orientation="horizontal" :items="items" />
  </a-flex>
</template>
```
