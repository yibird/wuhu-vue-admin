# Shape

## Description (en-US)

Change the shape of the FloatButton with the `shape` property.

## Source

```vue
<script setup lang="ts">
import { CustomerServiceOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button shape="circle" type="primary" style="inset-inline-end: 94px">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </a-float-button>
  <a-float-button shape="square" type="primary" style="inset-inline-end: 24px">
    <template #icon>
      <CustomerServiceOutlined />
    </template>
  </a-float-button>
</template>
```
