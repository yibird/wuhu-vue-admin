# Error Status

## Description (en-US)

By using `status` of `Steps`, you can specify the state for current step.

## Source

```vue
<script lang="ts" setup>
const content = 'This is a content'
const items = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Process',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
]
</script>

<template>
  <a-steps :current="1" status="error" :items="items" />
</template>
```
