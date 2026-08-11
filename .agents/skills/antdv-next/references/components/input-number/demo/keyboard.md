# Keyboard

## Description (en-US)

Control keyboard behavior by `keyboard`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const keyboard = ref(true)
const value = ref(3)
</script>

<template>
  <a-space>
    <a-input-number v-model:value="value" :min="1" :max="10" :keyboard="keyboard" />
    <a-checkbox v-model:checked="keyboard">
      Toggle keyboard
    </a-checkbox>
  </a-space>
</template>
```
