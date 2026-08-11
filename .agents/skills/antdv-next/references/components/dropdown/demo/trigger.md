# Trigger mode

## Description (en-US)

The default trigger mode is `hover`, you can change it to `click`.

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
    label: '3rd menu item',
    key: '3',
  },
]

const href: Record<string, string> = {
  0: 'https://www.antgroup.com',
  1: 'https://www.aliyun.com',
}
</script>

<template>
  <a-dropdown :menu="{ items }" :trigger="['click']">
    <a @click.prevent>
      <a-space>
        Click me
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
