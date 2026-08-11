# Loading

## Description (en-US)

Mark a pending state of switch.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const checked1 = shallowRef(true)
const checked2 = shallowRef(false)
</script>

<template>
  <a-switch v-model:checked="checked1" loading />
  <br>
  <a-switch v-model:checked="checked2" size="small" loading />
</template>
```
