# Type

## Description (en-US)

Change the type of the FloatButton with the `type` property.

## Source

```vue
<script setup lang="ts">
import { QuestionCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button type="primary" style="inset-inline-end: 24px;">
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </a-float-button>
  <a-float-button type="default" style="inset-inline-end: 94px;">
    <template #icon>
      <QuestionCircleOutlined />
    </template>
  </a-float-button>
</template>
```
