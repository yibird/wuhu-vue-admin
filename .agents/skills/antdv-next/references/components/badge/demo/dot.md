# Red badge

## Description (en-US)

This will simply display a red badge, without a specific count. If count equals 0, it won't display the dot.

## Source

```vue
<script setup lang="ts">
import { NotificationOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space>
    <a-badge dot>
      <NotificationOutlined style="font-size: 16px" />
    </a-badge>
    <a-badge dot>
      <a href="#">Link something</a>
    </a-badge>
  </a-space>
</template>
```
