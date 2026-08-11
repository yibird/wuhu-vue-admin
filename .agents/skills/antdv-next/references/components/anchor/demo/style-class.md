# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { AnchorProps } from 'antdv-next'

const classesObject: AnchorProps['classes'] = {
  root: 'demo-anchor-root',
  item: 'demo-anchor-item',
  itemTitle: 'demo-anchor-title',
  indicator: 'demo-anchor-indicator',
}

const stylesFn: AnchorProps['styles'] = (info) => {
  if (info.props.direction === 'vertical') {
    return {
      root: {
        backgroundColor: 'rgba(255,251,230,0.5)',
        height: '100vh',
      },
    }
  }
  return {}
}

const items: NonNullable<AnchorProps['items']> = [
  {
    key: 'part-1',
    href: '#part-1',
    title: 'Part 1',
  },
  {
    key: 'part-2',
    href: '#part-2',
    title: 'Part 2',
  },
  {
    key: 'part-3',
    href: '#part-3',
    title: 'Part 3',
  },
]
</script>

<template>
  <a-row>
    <a-col :span="16">
      <div id="part-1" style="height: 100vh; background: rgba(255, 0, 0, 0.08)" />
      <div id="part-2" style="height: 100vh; background: rgba(0, 255, 0, 0.08)" />
      <div id="part-3" style="height: 100vh; background: rgba(0, 0, 255, 0.08)" />
    </a-col>
    <a-col :span="8">
      <a-anchor replace :items="items" :styles="stylesFn" :classes="classesObject" />
    </a-col>
  </a-row>
</template>
```
