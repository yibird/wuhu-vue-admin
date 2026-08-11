# Basic

## Description (en-US)

Import icons from `@antdv-next/icons`, component name of icons with different theme is the icon name suffixed by the theme name. Specify the `spin` property to show the spinning animation.

## Source

```vue
<script setup lang="ts">
import {
  HomeOutlined,
  LoadingOutlined,
  SettingFilled,
  SmileOutlined,
  SyncOutlined,
} from '@antdv-next/icons'
</script>

<template>
  <a-space>
    <HomeOutlined />
    <SettingFilled />
    <SmileOutlined />
    <SyncOutlined spin />
    <SmileOutlined :rotate="180" />
    <LoadingOutlined />
  </a-space>
</template>
```
