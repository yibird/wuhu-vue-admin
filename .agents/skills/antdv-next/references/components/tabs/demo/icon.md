# Icon

## Description (en-US)

The Tab with Icon.

## Source

```vue
<script setup lang="ts">
import type { TabsProps } from 'antdv-next'
import { AndroidOutlined, AppleOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const icons = [AppleOutlined, AndroidOutlined]

const items: TabsProps['items'] = icons.map((Icon, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Tab ${id}`,
    icon: () => h(Icon),
  }
})
</script>

<template>
  <a-tabs default-active-key="2" :items="items" />
</template>
```
