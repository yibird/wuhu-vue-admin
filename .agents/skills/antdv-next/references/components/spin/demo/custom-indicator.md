# Custom spinning indicator

## Description (en-US)

Use custom loading indicator.

## Source

```vue
<script setup lang="ts">
import { LoadingOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-flex align="center" gap="middle">
    <a-spin size="small">
      <template #indicator>
        <LoadingOutlined spin />
      </template>
    </a-spin>
    <a-spin>
      <template #indicator>
        <LoadingOutlined spin />
      </template>
    </a-spin>
    <a-spin size="large">
      <template #indicator>
        <LoadingOutlined spin />
      </template>
    </a-spin>
    <a-spin>
      <template #indicator>
        <LoadingOutlined spin style="font-size: 48px" />
      </template>
    </a-spin>
  </a-flex>
</template>
```
