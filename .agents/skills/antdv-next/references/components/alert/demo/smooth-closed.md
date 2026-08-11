# Smoothly Unmount

## Description (en-US)

Smoothly unmount Alert upon close.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)

function handleAfterClose() {
  visible.value = false
}
</script>

<template>
  <a-alert
    v-if="visible"
    title="Alert Message Text"
    type="success"
    closable
    :after-close="handleAfterClose"
  />
  <p>click the close button to see the effect</p>
  <a-switch v-model:checked="visible" :disabled="visible" />
</template>
```
