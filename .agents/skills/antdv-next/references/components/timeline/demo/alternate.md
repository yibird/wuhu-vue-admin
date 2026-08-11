# Alternate

## Description (en-US)

Alternate timeline.

## Source

```vue
<script setup lang="ts">
import { ClockCircleOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const items = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
    color: 'green',
  },
  {
    icon: () => h(ClockCircleOutlined, { style: { fontSize: '16px' } }),
    content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
  },
  {
    color: 'red',
    content: 'Network problems being solved 2015-09-01',
  },
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    icon: () => h(ClockCircleOutlined, { style: { fontSize: '16px' } }),
    content: 'Technical testing 2015-09-01',
  },
]
</script>

<template>
  <a-timeline mode="alternate" :items="items" />
</template>
```
