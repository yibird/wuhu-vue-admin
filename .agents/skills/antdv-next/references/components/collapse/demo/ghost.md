# Ghost Collapse

## Description (en-US)

Making collapse's background transparent.

## Source

```vue
<script setup lang="ts">
import { h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    content: h('p', text),
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: h('p', text),
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: h('p', text),
  },
]
</script>

<template>
  <a-collapse :items="items" ghost :default-active-key="['1']" />
</template>
```
