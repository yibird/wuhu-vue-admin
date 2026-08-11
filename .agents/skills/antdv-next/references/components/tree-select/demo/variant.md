# Variants

## Description (en-US)

Variants of TreeSelect, there are four variants: `outlined` `filled` `borderless` and `underlined`.

## Source

```vue
<script setup lang="ts">
const style = {
  width: '100%',
  maxWidth: '100%',
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-tree-select :style="style" placeholder="Please select" variant="borderless" />
    <a-tree-select :style="style" placeholder="Please select" variant="filled" />
    <a-tree-select :style="style" placeholder="Please select" variant="outlined" />
    <a-tree-select :style="style" placeholder="Please select" variant="underlined" />
  </a-flex>
</template>
```
