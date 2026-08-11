# Disabled

## Description (en-US)

Disabled state of `Switch`.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)
const checked = ref(true)

function toggle() {
  disabled.value = !disabled.value
}
</script>

<template>
  <a-space vertical>
    <a-switch v-model:checked="checked" :disabled="disabled" />
    <a-button type="primary" @click="toggle">
      Toggle disabled
    </a-button>
  </a-space>
</template>
```
