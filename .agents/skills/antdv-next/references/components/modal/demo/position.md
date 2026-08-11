# To customize the position of modal

## Description (en-US)

You can use `centered`, `style.top` or other styles to set position of modal dialog.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const modalTopOpen = ref(false)
const modalCenterOpen = ref(false)
</script>

<template>
  <a-space direction="vertical" :size="24">
    <a-button type="primary" @click="modalTopOpen = true">
      Display a modal dialog at 20px to Top
    </a-button>
    <a-modal
      v-model:open="modalTopOpen"
      title="20px to Top"
      :style="{ top: '20px' }"
      @ok="modalTopOpen = false"
      @cancel="modalTopOpen = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>

    <a-button type="primary" @click="modalCenterOpen = true">
      Vertically centered modal dialog
    </a-button>
    <a-modal
      v-model:open="modalCenterOpen"
      title="Vertically centered modal dialog"
      centered
      @ok="modalCenterOpen = false"
      @cancel="modalCenterOpen = false"
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </a-space>
</template>
```
