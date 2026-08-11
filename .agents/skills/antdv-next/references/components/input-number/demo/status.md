# Status

## Description (en-US)

Add status to InputNumber with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
import { ClockCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space direction="vertical" style="width: 100%;">
    <a-input-number status="error" style="width: 100%;" />
    <a-input-number status="warning" style="width: 100%;" />
    <a-input-number status="error" style="width: 100%;">
      <template #prefix>
        <ClockCircleOutlined />
      </template>
    </a-input-number>
    <a-input-number status="warning" style="width: 100%;">
      <template #prefix>
        <ClockCircleOutlined />
      </template>
    </a-input-number>
  </a-space>
</template>
```
