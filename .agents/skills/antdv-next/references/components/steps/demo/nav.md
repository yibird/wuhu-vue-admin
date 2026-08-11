# Navigation Steps

## Description (en-US)

Navigation steps.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const current = ref(0)

const itemsWithContent = [
  {
    title: 'Step 1',
    subTitle: '00:00:05',
    status: 'finish' as const,
    content: 'This is a content.',
  },
  {
    title: 'Step 2',
    subTitle: '00:01:02',
    status: 'process' as const,
    content: 'This is a content.',
  },
  {
    title: 'Step 3',
    subTitle: 'waiting for longlong time',
    status: 'wait' as const,
    content: 'This is a content.',
  },
]

const itemsBasic = [
  {
    status: 'finish' as const,
    title: 'Step 1',
  },
  {
    status: 'process' as const,
    title: 'Step 2',
  },
  {
    status: 'wait' as const,
    title: 'Step 3',
  },
  {
    status: 'wait' as const,
    title: 'Step 4',
  },
]

const itemsWithDisabled = [
  {
    status: 'finish' as const,
    title: 'finish 1',
  },
  {
    status: 'finish' as const,
    title: 'finish 2',
  },
  {
    status: 'process' as const,
    title: 'current process',
  },
  {
    status: 'wait' as const,
    title: 'wait',
    disabled: true,
  },
]

function handleChange(value: number) {
  console.log('onChange:', value)
  current.value = value
}
</script>

<template>
  <a-flex vertical gap="large">
    <a-steps
      v-model:current="current"
      type="navigation"
      size="small"
      :items="itemsWithContent"
      @change="handleChange"
    />

    <a-steps
      v-model:current="current"
      type="navigation"
      :items="itemsBasic"
      @change="handleChange"
    />

    <a-steps
      v-model:current="current"
      type="navigation"
      size="small"
      :items="itemsWithDisabled"
      @change="handleChange"
    />
  </a-flex>
</template>
```
