# Control ToolTip

## Description (en-US)

When `tooltip.open` is `true`, ToolTip will always show, if set to `false` the ToolTip will not show, even if dragging or hovering.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
</script>

<template>
  <a-slider v-model:value="value" :tooltip="{ open: true }" />
</template>
```
