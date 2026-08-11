# Button with dropdown menu

## Description (en-US)

A button is on the left, and a related functional menu is on the right. You can set the icon property to modify the icon of right.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { DownOutlined, EllipsisOutlined, UserOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

function handleButtonClick(e: MouseEvent) {
  messageApi.info('Click on left button.')
  console.log('click left button', e)
}

function handleMenuClick(e: any) {
  messageApi.info('Click on menu item.')
  console.log('click', e)
}

const items: MenuItemType[] = [
  {
    label: '1st menu item',
    key: '1',
    icon: UserOutlined,
  },
  {
    label: '2nd menu item',
    key: '2',
    icon: UserOutlined,
  },
  {
    label: '3rd menu item',
    key: '3',
    icon: UserOutlined,
    danger: true,
  },
  {
    label: '4rd menu item',
    key: '4',
    icon: UserOutlined,
    danger: true,
    disabled: true,
  },
]

const menuProps = {
  items,
  onClick: handleMenuClick,
}
</script>

<template>
  <ContextHolder />
  <a-space wrap>
    <a-space-compact>
      <a-button @click="handleButtonClick">
        Dropdown
      </a-button>
      <a-dropdown :menu="menuProps" placement="bottomRight">
        <a-button>
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>

    <a-space-compact>
      <a-button @click="handleButtonClick">
        Dropdown
      </a-button>
      <a-dropdown :menu="menuProps" placement="bottomRight">
        <a-button>
          <template #icon>
            <UserOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>

    <a-space-compact>
      <a-button disabled @click="handleButtonClick">
        Dropdown
      </a-button>
      <a-dropdown :menu="menuProps" placement="bottomRight" disabled>
        <a-button disabled>
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>

    <a-space-compact>
      <a-tooltip title="tooltip">
        <a-button @click="handleButtonClick">
          With Tooltip
        </a-button>
      </a-tooltip>
      <a-dropdown :menu="menuProps" placement="bottomRight">
        <a-button loading />
      </a-dropdown>
    </a-space-compact>

    <a-dropdown :menu="menuProps">
      <a-button icon-placement="end" @click="handleButtonClick">
        <template #icon>
          <DownOutlined />
        </template>
        Button
      </a-button>
    </a-dropdown>

    <a-space-compact>
      <a-button danger @click="handleButtonClick">
        Danger
      </a-button>
      <a-dropdown :menu="menuProps" placement="bottomRight">
        <a-button danger>
          <template #icon>
            <EllipsisOutlined />
          </template>
        </a-button>
      </a-dropdown>
    </a-space-compact>
  </a-space>
</template>
```
