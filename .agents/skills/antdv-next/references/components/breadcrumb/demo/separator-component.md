# Configuring the Separator Independently

## Description (en-US)

Customize separator for each other.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType } from 'antdv-next'

const items: BreadcrumbItemType[] = [
  {
    title: 'Location',
  },
  {
    type: 'separator',
    separator: ':',
  },
  {
    href: '',
    title: 'Application Center',
  },
  {
    type: 'separator',
  },
  {
    href: '',
    title: 'Application List',
  },
  {
    type: 'separator',
  },
  {
    title: 'An Application',
  },
]
</script>

<template>
  <a-breadcrumb separator="" :items="items" />
</template>
```
