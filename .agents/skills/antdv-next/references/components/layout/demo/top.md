# Header-Content-Footer

## Description (en-US)

The most basic \"header-content-footer\" layout.

Generally, the mainnav is placed at the top of the page, and includes the logo, the first level navigation, and the secondary menu (users, settings, notifications) from left to right in it. We always put contents in a fixed size navigation (eg: `1200px`), the layout of the whole page is stable, it's not affected by the viewing area.

Top-bottom structure is conformed with the top-bottom viewing habit, it's a classical navigation pattern of websites. This pattern demonstrates efficiency in the main workarea, while using some vertical space. And because the horizontal space of the navigation is limited, this pattern is not suitable for cases when the first level navigation contains many elements or links.

## Source

```vue
<script setup lang="ts">
import type { BreadcrumbItemType, MenuItemType } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const items: MenuItemType[] = Array.from({ length: 15 }).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}))

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
        :items="items"
        class="demo-menu"
      />
    </a-layout-header>
    <a-layout-content class="demo-content">
      <a-breadcrumb class="demo-breadcrumb" :items="breadcrumbItems" />
      <div
        class="demo-content-box"
        :style="{
          background: token.colorBgContainer,
          borderRadius: `${token.borderRadiusLG}px`,
        }"
      >
        Content
      </div>
    </a-layout-content>
    <a-layout-footer class="demo-footer">
      Antdv Next ©{{ year }} Created by Ant UED
    </a-layout-footer>
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

.demo-content {
  padding: 0 48px;
}

.demo-breadcrumb {
  margin: 16px 0;
}

.demo-content-box {
  min-height: 280px;
  padding: 24px;
}

.demo-footer {
  text-align: center;
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
