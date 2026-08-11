# Title

## Description (en-US)

The badge will display `title` when hovered over, instead of `count`.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <a-space size="large">
    <a-badge :count="5" title="Custom hover text">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="-5" title="Negative">
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-space>
</template>
```
