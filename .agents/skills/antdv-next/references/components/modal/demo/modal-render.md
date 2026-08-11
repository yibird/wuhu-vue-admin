# Custom modal content render

## Description (en-US)

Custom modal content render. You can integrate drag libraries if needed.

## Source

```vue
<script setup lang="ts">
import { h, ref } from 'vue'

const open = ref(false)

function renderModal(node: any) {
  return h('div', { class: 'modal-render-wrapper' }, [node])
}
</script>

<template>
  <a-button type="primary" @click="open = true">
    Open Custom Render Modal
  </a-button>
  <a-modal
    v-model:open="open"
    title="Custom Render Modal"
    :modal-render="renderModal"
    @ok="open = false"
    @cancel="open = false"
  >
    <p>Just don't learn physics at school and your life will be full of magic and miracles.</p>
    <br>
    <p>Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
  </a-modal>
</template>

<style scoped>
.modal-render-wrapper {
  padding: 8px;
  background: rgba(245, 245, 245, 0.7);
  border-radius: 8px;
}
</style>
```
