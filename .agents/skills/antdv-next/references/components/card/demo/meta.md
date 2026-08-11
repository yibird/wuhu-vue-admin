# Support more content configuration

## Description (en-US)

A Card that supports `cover`, `avatar`, `title` and `description`.

## Source

```vue
<script setup lang="ts">
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-card style="width: 300px">
    <template #cover>
      <img
        draggable="false"
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      >
    </template>
    <template #actions>
      <SettingOutlined key="setting" />
      <EditOutlined key="edit" />
      <EllipsisOutlined key="ellipsis" />
    </template>
    <a-card-meta title="Card title" description="This is the description">
      <template #avatar>
        <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
      </template>
    </a-card-meta>
  </a-card>
</template>
```
