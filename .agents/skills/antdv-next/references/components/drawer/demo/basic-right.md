# Basic

## Description (en-US)

Basic drawer.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
function showDrawer() {
  open.value = true
}
</script>

<template>
  <a-button type="primary" @click="showDrawer">
    Open
  </a-button>
  <a-drawer
    v-model:open="open"
    title="Basic Drawer"
    :closable="{ 'aria-label': 'Close Button' }"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
```
