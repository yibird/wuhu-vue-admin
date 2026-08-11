# Menu mode

## Description (en-US)

Open menu mode with `trigger`, which could be `hover` or `click`.

## Source

```vue
<script setup lang="ts">
import { CommentOutlined, CustomerServiceOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button-group
    trigger="click"
    type="primary"
    shape="square"
    style="inset-inline-end: 24px"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>

  <a-float-button-group
    trigger="hover"
    type="primary"
    style="inset-inline-end: 94px"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<style scoped>

</style>
```
