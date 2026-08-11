# Custom component token

## Description (en-US)

Custom component token.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const checked = shallowRef(true)
const theme = {
  components: {
    Switch: {
      trackHeight: 14,
      trackMinWidth: 32,
      // opacityLoading: 0.1,
      colorPrimary: 'rgb(25, 118, 210, 0.5)',
      trackPadding: -3,
      handleSize: 20,
      handleBg: 'rgb(25, 118, 210)',
      handleShadow:
        'rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px',
      // innerMinMargin: 4,
      // innerMaxMargin: 8,
    },
  },
}
</script>

<template>
  <a-config-provider :theme="theme">
    <a-space>
      <a-switch v-model:checked="checked" />
    </a-space>
  </a-config-provider>
</template>
```
