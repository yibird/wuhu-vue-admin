# Label

## Description (en-US)

Use `title` show time alone.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const mode = ref<'start' | 'alternate' | 'end'>('start')

const items = [
  {
    title: '2015-09-01',
    content: 'Create a services',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Solve initial network problems',
  },
  {
    content: 'Technical testing',
  },
  {
    title: '2015-09-01 09:12:11',
    content: 'Network problems being solved',
  },
]
</script>

<template>
  <div>
    <a-radio-group v-model:value="mode" :style="{ marginBottom: '20px' }">
      <a-radio value="start">
        Start
      </a-radio>
      <a-radio value="end">
        End
      </a-radio>
      <a-radio value="alternate">
        Alternate
      </a-radio>
    </a-radio-group>
    <a-timeline :mode="mode" :items="items" />
  </div>
</template>
```
