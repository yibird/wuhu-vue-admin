# Preset size

## Description (en-US)

The default width (or height) of Drawer is `378px`, and there is a preset large size `736px`.

## Source

```vue
<script setup lang="ts">
import type { DrawerProps } from 'antdv-next'
import { shallowRef } from 'vue'

const open = shallowRef(false)
const size = shallowRef<DrawerProps['size']>('default')

function showDefaultDrawer() {
  size.value = 'default'
  open.value = true
}

function showLargeDrawer() {
  size.value = 'large'
  open.value = true
}

function onClose() {
  open.value = false
}
</script>

<template>
  <a-space>
    <a-button type="primary" @click="showDefaultDrawer">
      Open Default Size (378px)
    </a-button>
    <a-button type="primary" @click="showLargeDrawer">
      Open Large Size (736px)
    </a-button>
  </a-space>
  <a-drawer
    v-model:open="open"
    :title="`${size} Drawer`"
    placement="right"
    :size="size"
    @close="onClose"
  >
    <template #extra>
      <a-space>
        <a-button @click="onClose">
          Cancel
        </a-button>
        <a-button type="primary" @click="onClose">
          OK
        </a-button>
      </a-space>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
```
