# Status

## Description (en-US)

Add status to TimePicker with `status`, which could be `error` or `warning`.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <a-space vertical>
    <a-time-picker status="error" />
    <a-time-picker status="warning" />
    <a-time-range-picker status="error" />
    <a-time-range-picker status="warning" />
  </a-space>
</template>
```
