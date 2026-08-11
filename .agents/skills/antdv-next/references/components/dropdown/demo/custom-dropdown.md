# Custom dropdown

## Description (en-US)

Customize the dropdown menu via `popupRender`. If you don't need the Menu content, use the Popover component directly.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { computed } from 'vue'

const items: MenuItemType[] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item (disabled)',
    disabled: true,
  },
  {
    key: '3',
    label: '3rd menu item (disabled)',
    disabled: true,
  },
]

const href: Record<string, string> = {
  1: 'https://www.antgroup.com',
  2: 'https://www.aliyun.com',
  3: 'https://www.luohanacademy.com',
}

const { token } = theme.useToken()

const contentStyle = computed(() => ({
  backgroundColor: token.value.colorBgElevated,
  borderRadius: token.value.borderRadiusLG,
  boxShadow: token.value.boxShadowSecondary,
}))

const menuStyle = {
  boxShadow: 'none',
}
</script>

<template>
  <a-dropdown :menu="{ items }">
    <template #popupRender="menu">
      <div :style="contentStyle">
        <component :is="menu" :style="menuStyle" />
        <a-divider style="margin: 0" />
        <a-space style="padding: 8px">
          <a-button type="primary">
            Click me!
          </a-button>
        </a-space>
      </div>
    </template>
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
