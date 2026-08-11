# Context Menu

## Description (en-US)

The default trigger mode is `hover`, you can change it to `contextMenu`. The pop-up menu position will follow the right-click position.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { theme } from 'antdv-next'

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

const { token } = theme.useToken()
</script>

<template>
  <a-dropdown :menu="{ items }" :trigger="['contextmenu']">
    <div
      :style="{
        color: token.colorTextTertiary,
        background: token.colorBgLayout,
        height: '200px',
        textAlign: 'center',
        lineHeight: '200px',
      }"
    >
      Right Click on here
    </div>
  </a-dropdown>
</template>
```
