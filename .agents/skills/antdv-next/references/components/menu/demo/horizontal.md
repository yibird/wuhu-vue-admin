# Top Navigation

## Description (en-US)

Horizontal top navigation menu.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const current = ref('mail')

function handleClick(e: any) {
  console.log('click ', e)
  current.value = e.key
}

const items: MenuItemType[] = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: MailOutlined,
  },
  {
    label: 'Navigation Two',
    key: 'app',
    icon: AppstoreOutlined,
    disabled: true,
  },
  {
    label: 'Navigation Three - Submenu',
    key: 'SubMenu',
    icon: SettingOutlined,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          { label: 'Option 1', key: 'setting:1' },
          { label: 'Option 2', key: 'setting:2' },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          { label: 'Option 3', key: 'setting:3' },
          { label: 'Option 4', key: 'setting:4' },
        ],
      },
    ],
  },
  {
    key: 'alipay',
    label: h(
      'a',
      {
        href: 'https://ant.design',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Navigation Four - Link',
    ),
  },
]
</script>

<template>
  <a-menu
    :selected-keys="[current]"
    mode="horizontal"
    :items="items"
    @click="handleClick"
  />
</template>
```
