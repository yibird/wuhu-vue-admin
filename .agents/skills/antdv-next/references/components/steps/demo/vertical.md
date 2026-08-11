# Vertical

## Description (en-US)

A simple step bar in the vertical orientation.

## Source

```vue
<script lang="ts" setup>
const content = 'This is a content.'

const items = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Progress',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
]
</script>

<template>
  <a-flex>
    <div :style="{ flex: 1 }">
      <a-steps orientation="vertical" :current="1" :items="items" />
    </div>
    <div :style="{ flex: 1 }">
      <a-steps orientation="vertical" :current="1" :items="items" size="small" />
    </div>
  </a-flex>
</template>
```
