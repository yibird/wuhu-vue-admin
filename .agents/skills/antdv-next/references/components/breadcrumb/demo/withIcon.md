# With an Icon

## Description (en-US)

The icon should be placed in front of the text.

## Source

```vue
<script lang="ts" setup>
import type { BreadcrumbItemType } from 'antdv-next'
import { HomeOutlined, UserOutlined } from '@antdv-next/icons'

const items: BreadcrumbItemType[] = [
  {
    href: '',
  },
  {
    href: '',
  },
  {
    title: 'Application',
  },
]
</script>

<template>
  <a-breadcrumb :items="items">
    <template #titleRender="{ index }">
      <template v-if="index === 0">
        <HomeOutlined />
      </template>
      <template v-if="index === 1">
        <UserOutlined />
        <span>Application List</span>
      </template>
    </template>
  </a-breadcrumb>
</template>
```
