# Size

## Description (en-US)

Antdv Next supports a default collapse size as well as a large and small size.

If a large or small collapse is desired, set the `size` property to either `large` or `small` respectively. Omit the `size` property for a collapse with the default size.

## Source

```vue
<script setup lang="ts">
import { h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const defaultItems = [
  {
    key: '1',
    label: 'This is default size panel header',
    content: h('p', text),
  },
]

const smallItems = [
  {
    key: '1',
    label: 'This is small size panel header',
    content: h('p', text),
  },
]

const largeItems = [
  {
    key: '1',
    label: 'This is large size panel header',
    content: h('p', text),
  },
]
</script>

<template>
  <a-divider title-placement="start">
    Default Size
  </a-divider>
  <a-collapse :items="defaultItems" />
  <a-divider title-placement="start">
    Small Size
  </a-divider>
  <a-collapse size="small" :items="smallItems" />
  <a-divider title-placement="start">
    Large Size
  </a-divider>
  <a-collapse size="large" :items="largeItems" />
</template>
```
