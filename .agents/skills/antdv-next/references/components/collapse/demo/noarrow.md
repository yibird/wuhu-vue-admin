# No arrow

## Description (en-US)

You can hide the arrow icon by passing `showArrow=false` to the panel.

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
    label: 'This is panel header with arrow icon',
    content: h('p', text),
  },
  {
    key: '2',
    label: 'This is panel header with no arrow icon',
    content: h('p', text),
    showArrow: false,
  },
]

function onChange(key: string[]) {
  console.log(key)
}
</script>

<template>
  <a-collapse :items="items" :default-active-key="['1']" @change="onChange" />
</template>
```
