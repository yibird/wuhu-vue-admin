# Customized Footer render function

## Description (en-US)

Customize the footer rendering function to support extensions on top of the original.

## Source

```vue
<script setup lang="ts">
import { Button, Modal } from 'antdv-next'
import { h, ref } from 'vue'

const open = ref(false)

function showModal() {
  open.value = true
}

function handleOk() {
  open.value = false
}
function handleCancel() {
  open.value = false
}

function handleConfirm() {
  Modal.confirm({
    title: 'Confirm',
    content: 'Bla bla ...',
    footer: ({ extra }: any) => {
      return [
        h(Button, undefined, { default: () => 'Custom Button' }),
        h(extra.OkBtn),
        h(extra.CancelBtn),
      ]
    },
  })
}
</script>

<template>
  <a-space>
    <a-button type="primary" @click="showModal">
      Open Modal
    </a-button>
    <a-button type="primary" @click="handleConfirm">
      Open Modal Confirm
    </a-button>
  </a-space>
  <a-modal
    v-model:open="open"
    title="Title"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #footer="{ extra }">
      <a-button> Custom Button</a-button>
      <component :is="extra.CancelBtn" />
      <component :is="extra.OkBtn" />
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>
```
