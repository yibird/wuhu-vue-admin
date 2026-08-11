# FloatButton Group

## Description (en-US)

When multiple buttons are used together, `<a-float-button-group />` is recommended. By setting the `shape` property of FloatButton.Group, you can change the shape of group. The `shape` of the FloatButton.Group will override the `shape` of FloatButtons inside.

## Source

```vue
<script setup lang="ts">
import { QuestionCircleOutlined, SyncOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button-group shape="circle" style="inset-inline-end: 24px;">
    <a-float-button>
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <a-float-button />
    <a-float-back-top :visibility-height="0" />
  </a-float-button-group>
  <a-float-button-group shape="square" style="inset-inline-end: 94px;">
    <a-float-button>
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <a-float-button />
    <a-float-button>
      <template #icon>
        <SyncOutlined />
      </template>
    </a-float-button>
    <a-float-back-top :visibility-height="0" />
  </a-float-button-group>
</template>
```
