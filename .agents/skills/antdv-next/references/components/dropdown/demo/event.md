# Click event

## Description (en-US)

An event will be triggered when you click menu items, in which you can make different operations according to item's key.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

function onClick({ key }: any) {
  messageApi.info(`Click on item ${key}`)
}

const items: MenuItemType[] = [
  {
    label: '1st menu item',
    key: '1',
  },
  {
    label: '2nd menu item',
    key: '2',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
]
</script>

<template>
  <ContextHolder />
  <a-dropdown :menu="{ items }" @menu-click="onClick">
    <a @click.prevent>
      <a-space>
        Hover me, Click menu item
        <DownOutlined />
      </a-space>
    </a>
  </a-dropdown>
</template>
```
