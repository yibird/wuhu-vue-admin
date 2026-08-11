# Basic

## Description (en-US)

The most basic dropdown menu.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined, SmileOutlined } from '@antdv-next/icons'

const items: MenuItemType[] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item (disabled)',
    icon: SmileOutlined,
    disabled: true,
  },
  {
    key: '3',
    label: '3rd menu item (disabled)',
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
]
const href: Record<string, string> = {
  1: 'https://www.antgroup.com',
  2: 'https://www.aliyun.com',
  3: 'https://www.luohanacademy.com',
}
</script>

<template>
  <a-dropdown :menu="{ items }">
    <a @click.prevent>
      <a-space>
        Hover me
        <DownOutlined />
      </a-space>
    </a>
    <template #labelRender="item">
      <template v-if="item && ['1', '2', '3'].includes(item.key as string)">
        <a target="_blank" rel="noopener noreferrer" :href="href[item.key as string]">
          {{ item?.label }}
        </a>
      </template>
    </template>
  </a-dropdown>
</template>
```
