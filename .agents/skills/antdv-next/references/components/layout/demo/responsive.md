# Responsive

## Description (en-US)

a-layout-sider supports responsive layout.

> Note: You can get a responsive layout by setting `breakpoint`. The Sider will collapse to the width of `collapsedWidth` when window width is below the `breakpoint`. A special trigger will appear if `collapsedWidth` is set to 0.

## Source

```vue
<script setup lang="ts">
import type { MenuItemType } from 'antdv-next'
import { BarsOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'

const { token } = theme.useToken()
const year = new Date().getFullYear()

const items: MenuItemType[] = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
  (icon, index) => ({
    key: String(index + 1),
    icon,
    label: `nav ${index + 1}`,
  }),
)

function handleBreakpoint(broken: boolean) {
  console.log(broken)
}

function handleCollapse(collapsed: boolean, type: string) {
  console.log(collapsed, type)
}
</script>

<template>
  <a-layout>
    <a-layout-sider
      breakpoint="lg"
      :collapsed-width="0"
      @breakpoint="handleBreakpoint"
      @collapse="handleCollapse"
    >
      <template #trigger>
        <BarsOutlined />
      </template>
      <div class="demo-logo-vertical" />
      <a-menu
        theme="dark"
        mode="inline"
        :default-selected-keys="['4']"
        :items="items"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="responsive-header" :style="{ background: token.colorBgContainer }" />
      <a-layout-content class="responsive-content">
        <div
          class="responsive-content-box"
          :style="{
            background: token.colorBgContainer,
            borderRadius: `${token.borderRadiusLG}px`,
          }"
        >
          content
        </div>
      </a-layout-content>
      <a-layout-footer class="responsive-footer">
        Antdv Next ©{{ year }} Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.responsive-header {
  padding: 0;
}

.responsive-content {
  margin: 24px 16px 0;
}

.responsive-content-box {
  padding: 24px;
  min-height: 360px;
}

.responsive-footer {
  text-align: center;
}

.demo-logo-vertical {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
```
