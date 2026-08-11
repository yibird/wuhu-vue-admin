# Disabled

## Description (en-US)

Disabled checkbox.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const checked1 = ref(false)
const checked2 = ref(false)
const checked3 = ref(true)
</script>

<template>
  <a-checkbox v-model:checked="checked1" disabled />
  <br>
  <a-checkbox v-model:checked="checked2" disabled indeterminate />
  <br>
  <a-checkbox v-model:checked="checked3" disabled />
</template>
```
