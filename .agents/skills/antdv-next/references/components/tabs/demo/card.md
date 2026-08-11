# Card type tab

## Description (en-US)

Another type of Tabs, which doesn't support vertical mode.

## Source

```vue
<script setup lang="ts">
import type { TabsProps } from 'antdv-next'

function onChange(key: string) {
  console.log(key)
}

const items: TabsProps['items'] = Array.from({ length: 3 }).map((_, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Content of Tab Pane ${id}`,
  }
})
</script>

<template>
  <a-tabs default-active-key="1" type="card" :items="items" @change="onChange" />
</template>
```
