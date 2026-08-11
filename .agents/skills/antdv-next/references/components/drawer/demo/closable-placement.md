# Closable placement

## Description (en-US)

Drawer with closable placement, customize the close placement to the `end`, defaults to `start`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
function showDrawer() {
  open.value = true
}
function onClose() {
  open.value = false
}
</script>

<template>
  <a-button type="primary" @click="showDrawer">
    Open
  </a-button>
  <a-drawer
    v-model:open="open"
    title="Drawer Closable Placement"
    :closable="{ placement: 'end' }"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Take a look at the top-right corner...</p>
  </a-drawer>
</template>
```
