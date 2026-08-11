# mask

## Description (en-US)

mask effect, default `blur`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

type MaskType = 'blur' | 'dimmed' | 'none'
interface DrawerConfig {
  type: MaskType
  mask: boolean | { blur: boolean }
  title: string
}

const drawerList: DrawerConfig[] = [
  { type: 'blur', mask: true, title: 'Default blur' },
  { type: 'dimmed', mask: { blur: false }, title: 'Dimmed mask' },
  { type: 'none', mask: false, title: 'No mask' },
]

const open = shallowRef<false | MaskType>(false)

function showDrawer(type: MaskType) {
  open.value = type
}

function onClose() {
  open.value = false
}
</script>

<template>
  <a-space wrap>
    <template v-for="item in drawerList" :key="item.type">
      <a-button @click="showDrawer(item.type)">
        {{ item.title }}
      </a-button>
      <a-drawer
        :open="open === item.type"
        title="Drawer blur"
        placement="right"
        :mask="item.mask"
        @close="onClose"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-drawer>
    </template>
  </a-space>
</template>
```
