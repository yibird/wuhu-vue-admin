# mask

## Description (en-US)

mask effect.

## Source

```vue
<script setup lang="ts">
import { Modal } from 'antdv-next'

const modalConfig = {
  title: 'Title',
  content: 'Some contents...',
}

const [modal, ContextHolder] = Modal.useModal()

function showBlur() {
  modal.confirm({ ...modalConfig, mask: { blur: true } })
}

function showDimmed() {
  modal.confirm({ ...modalConfig, mask: { blur: false } })
}

function showNoMask() {
  modal.confirm({ ...modalConfig, mask: false })
}
</script>

<template>
  <a-space>
    <a-button @click="showBlur">
      blur
    </a-button>
    <a-button @click="showDimmed">
      Dimmed mask
    </a-button>
    <a-button @click="showNoMask">
      No mask
    </a-button>
  </a-space>
  <ContextHolder />
</template>
```
