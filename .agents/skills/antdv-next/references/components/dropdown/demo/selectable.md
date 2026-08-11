# Selectable Menu

## Description (en-US)

Configure the `selectable` property in `menu` to enable selectable ability.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'

const items: MenuItemType[] = [
  {
    key: '1',
    label: 'Item 1',
  },
  {
    key: '2',
    label: 'Item 2',
  },
  {
    key: '3',
    label: 'Item 3',
  },
]
</script>

<template>
  <a-dropdown
    :menu="{
      items,
      selectable: true,
      defaultSelectedKeys: ['3'],
    }"
  >
    <a-typography-link>
      <a-space>
        Selectable
        <DownOutlined />
      </a-space>
    </a-typography-link>
  </a-dropdown>
</template>
```
