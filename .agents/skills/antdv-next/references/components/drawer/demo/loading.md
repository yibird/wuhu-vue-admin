# Loading

## Description (en-US)

Set the loading status of Drawer.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
const loading = shallowRef(true)

function showLoading() {
  open.value = true
  loading.value = true

  // Simple loading mock. You should add cleanup logic in real world.
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<template>
  <a-button type="primary" @click="showLoading">
    Open Drawer
  </a-button>
  <a-drawer
    v-model:open="open"
    closable
    destroy-on-hidden
    placement="right"
    :loading="loading"
  >
    <template #title>
      <p class="m-0">
        Loading Drawer
      </p>
    </template>
    <a-button type="primary" style="margin-bottom: 16px" @click="showLoading">
      Reload
    </a-button>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
```
