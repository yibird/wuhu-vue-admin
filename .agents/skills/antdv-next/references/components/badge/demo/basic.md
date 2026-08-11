# Basic

## Description (en-US)

Simplest Usage. Badge will be hidden when `count` is `0`, but we can use `showZero` to show it.

## Source

```vue
<script setup lang="ts">
import { ClockCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space size="middle">
    <a-badge :count="5">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="0" show-zero>
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge>
      <template #count>
        <ClockCircleOutlined style="color: #f5222d" />
      </template>
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-space>
</template>
```
