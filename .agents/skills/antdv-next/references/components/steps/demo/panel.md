# Panel Steps

## Description (en-US)

Panel style steps.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref(0)

const items = [
  {
    title: 'Step 1',
    subTitle: '00:00',
    content: 'This is a content.',
  },
  {
    title: 'Step 2',
    content: 'This is a content.',
    status: 'error' as const,
  },
  {
    title: 'Step 3',
    content: 'This is a content.',
  },
]

function handleChange(value: number) {
  console.log('onChange:', value)
  current.value = value
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-steps
      v-model:current="current"
      type="panel"
      :items="items"
      @change="handleChange"
    />
    <a-steps
      v-model:current="current"
      type="panel"
      size="small"
      variant="outlined"
      :items="items"
      @change="handleChange"
    />
  </a-flex>
</template>
```
