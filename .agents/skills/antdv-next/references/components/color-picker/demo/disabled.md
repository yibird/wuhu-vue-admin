# Disable

## Description (en-US)

Set to disabled state.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const color = shallowRef('#1677ff')
</script>

<template>
  <a-color-picker v-model:value="color" show-text disabled />
</template>
```
