# Offset

## Description (en-US)

Set offset of the badge dot, the format is `[left, top]`, which represents the offset of the status dot from the left and top of the default position.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <a-badge :count="5" :offset="[10, 10]">
    <a-avatar shape="square" size="large" />
  </a-badge>
</template>
```
