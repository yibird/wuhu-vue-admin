# badge

## Description (en-US)

FloatButton with Badge.

## Source

```vue
<script setup lang="ts">
import { QuestionCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-float-button shape="circle" style="inset-inline-end: calc(24px + 70px + 70px)" :badge="{ dot: true }" />
  <a-float-button-group shape="circle" style="inset-inline-end: calc(24px + 70px)">
    <a-float-button href="https://antdv-next.com" :badge="{ count: 5, color: 'blue' }">
      <template #tooltip>
        <div>Custom badge color</div>
      </template>
    </a-float-button>
    <a-float-button :badge="{ count: 5 }" />
  </a-float-button-group>
  <a-float-button-group shape="circle">
    <a-float-button :badge="{ count: 12 }">
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <a-float-button :badge="{ count: 123, overflowCount: 999 }" />
    <a-float-back-top :visibility-height="0" />
  </a-float-button-group>
</template>
```
