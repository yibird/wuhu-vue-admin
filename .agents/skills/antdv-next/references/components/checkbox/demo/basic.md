# Basic

## Description (en-US)

Basic usage of checkbox.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const checked = shallowRef(false)
</script>

<template>
  <a-checkbox v-model:checked="checked">
    Checkbox
  </a-checkbox>
</template>
```
