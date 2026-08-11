# With Badge

## Description (en-US)

Usually used for reminders and notifications.

## Source

```vue
<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space :size="24">
    <a-badge :count="1">
      <a-avatar shape="square">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </a-badge>
    <a-badge dot>
      <a-avatar shape="square">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
    </a-badge>
  </a-space>
</template>
```
