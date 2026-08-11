# Multi-level drawer

## Description (en-US)

Open a new drawer on top of an existing drawer to handle multi branch tasks.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)
const childrenDrawer = shallowRef(false)

function showDrawer() {
  open.value = true
}

function onClose() {
  open.value = false
}

function showChildrenDrawer() {
  childrenDrawer.value = true
}

function onChildrenDrawerClose() {
  childrenDrawer.value = false
}
</script>

<template>
  <a-button type="primary" @click="showDrawer">
    Open drawer
  </a-button>
  <a-drawer
    v-model:open="open"
    title="Multi-level drawer"
    :size="520"
    :closable="false"
    @close="onClose"
  >
    <a-button type="primary" @click="showChildrenDrawer">
      Two-level drawer
    </a-button>
    <a-drawer
      v-model:open="childrenDrawer"
      title="Two-level Drawer"
      :size="320"
      :closable="false"
      @close="onChildrenDrawerClose"
    >
      This is two-level drawer
    </a-drawer>
  </a-drawer>
</template>
```
