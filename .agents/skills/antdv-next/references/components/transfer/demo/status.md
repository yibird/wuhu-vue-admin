# Status

## Description (en-US)

Add status to Transfer with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
const emptyData: any[] = []
</script>

<template>
  <a-flex vertical gap="middle">
    <a-transfer :data-source="emptyData" status="error" />
    <a-transfer :data-source="emptyData" status="warning" show-search />
  </a-flex>
</template>
```
