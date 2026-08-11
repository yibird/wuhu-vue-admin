# Disabled Alpha

## Description (en-US)

Disabled color alpha.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const color = shallowRef('#1677ff')
</script>

<template>
  <a-color-picker v-model:value="color" disabled-alpha />
</template>
```
