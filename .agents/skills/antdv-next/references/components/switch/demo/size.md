# Two sizes

## Description (en-US)

`size="small"` represents a small sized switch.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const checked1 = shallowRef(true)
const checked2 = shallowRef(true)
</script>

<template>
  <a-switch v-model:checked="checked1" />
  <br>
  <a-switch v-model:checked="checked2" size="small" />
</template>
```
