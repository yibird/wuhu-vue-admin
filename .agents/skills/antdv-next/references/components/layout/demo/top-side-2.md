# Header Sider 2

## Description (en-US)

Both the top navigation and the sidebar, commonly used in application site.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType, MenuItemType } from 'antdv-next'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const items1: MenuItemType[] = ['1', '2', '3'].map(key => ({
  key,
  label: `nav ${key}`,
}))

const items2: MenuItemType[] = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1)
  return {
    key: `sub${key}`,
    icon,
    label: `subnav ${key}`,
    children: Array.from({ length: 4 }).map((_, childIndex) => {
      const childKey = index * 4 + childIndex + 1
      return {
        key: String(childKey),
        label: `option${childKey}`,
      }
    }),
  }
})

const breadcrumbItems: BreadcrumbItemType[] = [
  { title: 'Home' },
  { title: 'List' },
  { title: 'App' },
]
</script>

<template>
  <a-layout>
    <a-layout-header class="demo-header">
      <div class="demo-logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['2']"
        :items="items1"
        class="demo-menu"
      />
    </a-layout-header>
    <a-layout>
      <a-layout-sider :width="200" :style="{ background: token.colorBgContainer }">
        <a-menu
          mode="inline"
          :default-selected-keys="['1']"
          :default-open-keys="['sub1']"
          :items="items2"
          class="demo-sider-menu"
        />
      </a-layout-sider>
      <a-layout class="demo-main">
        <a-breadcrumb class="demo-breadcrumb" :items="breadcrumbItems" />
        <a-layout-content
          class="demo-content"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          Content
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.demo-header {
  display: flex;
  align-items: center;
}

.demo-menu {
  flex: 1;
  min-width: 0;
}

.demo-sider-menu {
  height: 100%;
  border-inline-end: 0;
}

.demo-main {
  padding: 0 24px 24px;
}

.demo-breadcrumb {
  margin: 16px 0;
}

.demo-content {
  padding: 24px;
  margin: 0;
  min-height: 280px;
}

.demo-logo {
  width: 120px;
  height: 32px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
```
