# Custom Placement

## Description (en-US)

The Drawer can appear from any edge of the screen.

## Source

```vue
<script setup lang="ts">
import type { DrawerProps } from 'antdv-next'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const placement = shallowRef<DrawerProps['placement']>('left')

function showDrawer() {
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <a-space>
    <a-radio-group v-model:value="placement">
      <a-radio value="top">
        top
      </a-radio>
      <a-radio value="right">
        right
      </a-radio>
      <a-radio value="bottom">
        bottom
      </a-radio>
      <a-radio value="left">
        left
      </a-radio>
    </a-radio-group>
    <a-button type="primary" @click="showDrawer">
      Open
    </a-button>
  </a-space>
  <a-drawer
    v-model:open="open"
    title="Basic Drawer"
    :placement="placement"
    :closable="false"
    @close="onClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
```
