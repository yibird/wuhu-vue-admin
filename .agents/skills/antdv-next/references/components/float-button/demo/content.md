# Content

## Description (en-US)

Setting the `content` property allows you to show a FloatButton with a description.

> supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.

## Source

```vue
<script setup lang="ts">
import { FileTextOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button
    shape="square"
    content="HELP INFO"
    style="inset-inline-end: 24px;"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </a-float-button>
  <a-float-button
    shape="square"
    content="HELP INFO"
    style="inset-inline-end: 94px;"
  />
  <a-float-button
    shape="square"
    content="HELP"
    style="inset-inline-end: 164px;"
  >
    <template #icon>
      <FileTextOutlined />
    </template>
  </a-float-button>
</template>
```
