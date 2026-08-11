# Static Method

## Description (en-US)

Static methods cannot consume Context provided by ConfigProvider. When enable `layer`, they may also cause style errors. Please use hooks version or `App` provided instance first.

## Source

```vue
<script setup lang="ts">
import { Modal } from 'antdv-next'
import { h } from 'vue'

function info() {
  Modal.info({
    title: 'This is a notification message',
    content: h('div', [
      h('p', 'some messages...some messages...'),
      h('p', 'some messages...some messages...'),
    ]),
    onOk() {},
  })
}

function success() {
  Modal.success({
    content: 'some messages...some messages...',
  })
}

function error() {
  Modal.error({
    title: 'This is an error message',
    content: 'some messages...some messages...',
  })
}

function warning() {
  Modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  })
}
</script>

<template>
  <a-space wrap>
    <a-button @click="info">
      Info
    </a-button>
    <a-button @click="success">
      Success
    </a-button>
    <a-button @click="error">
      Error
    </a-button>
    <a-button @click="warning">
      Warning
    </a-button>
  </a-space>
</template>
```
