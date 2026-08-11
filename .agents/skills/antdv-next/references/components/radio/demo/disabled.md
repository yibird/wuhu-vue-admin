# disabled

## Description (en-US)

Radio unavailable.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const disabled = shallowRef(true)
function toggleDisabled() {
  disabled.value = !disabled.value
}
</script>

<template>
  <a-space direction="vertical">
    <a-space>
      <a-radio :checked="false" :disabled="disabled">
        Disabled
      </a-radio>
      <a-radio :checked="true" :disabled="disabled">
        Disabled
      </a-radio>
    </a-space>
    <a-button type="primary" @click="toggleDisabled">
      Toggle disabled
    </a-button>
  </a-space>
</template>
```
