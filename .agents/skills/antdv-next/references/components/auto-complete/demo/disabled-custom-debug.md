# Disabled custom input debug

## Description (en-US)

Disabled custom input debug.

## Source

```vue
<script setup lang="ts">
</script>

<template>
  <a-flex :gap="12" wrap>
    <a-input disabled placeholder="Regular Input" />
    <a-auto-complete disabled>
      <a-textarea disabled />
    </a-auto-complete>
    <a-select disabled :options="[]" />
  </a-flex>
</template>
```
