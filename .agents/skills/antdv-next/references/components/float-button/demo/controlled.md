# Controlled mode

## Description (en-US)

Set the component to controlled mode through `open`, which need to be used together with `trigger`.

## Source

```vue
<script setup lang="ts">
import { CommentOutlined, CustomerServiceOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const open = ref(true)
</script>

<template>
  <a-switch v-model:checked="open" style="margin: 16px;" />
  <a-float-button-group
    :open="open"
    trigger="click"
    style="inset-inline-end: 24px;"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
  <a-float-button-group
    :open="open"
    shape="square"
    trigger="click"
    style="inset-inline-end: 88px;"
  >
    <template #icon>
      <CustomerServiceOutlined />
    </template>
    <a-float-button />
    <a-float-button />
    <a-float-button>
      <template #icon>
        <CommentOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>
```
