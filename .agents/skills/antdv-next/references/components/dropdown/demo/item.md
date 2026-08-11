# Other elements

## Description (en-US)

Divider and disabled menu item.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'

const items: MenuItemType[] = [
  {
    label: '1st menu item',
    key: '0',
  },
  {
    label: '2nd menu item',
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item (disabled)',
    key: '3',
    disabled: true,
  },
]

const href: Record<string, string> = {
  0: 'https://www.antgroup.com',
  1: 'https://www.aliyun.com',
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
      <a
        v-if="item && ['0', '1'].includes(item.key as string)"
        target="_blank"
        rel="noopener noreferrer"
        :href="href[item.key as string]"
      >
        {{ item?.label }}
      </a>
    </template>
  </a-dropdown>
</template>
```
