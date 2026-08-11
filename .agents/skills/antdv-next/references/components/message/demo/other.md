# Other types of message

## Description (en-US)

Messages of success, error and warning types.

## Source

```vue
<script setup lang="ts">
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

function success() {
  messageApi.open({
    type: 'success',
    content: 'This is a success message',
  })
}

function error() {
  messageApi.open({
    type: 'error',
    content: 'This is an error message',
  })
}

function warning() {
  messageApi.open({
    type: 'warning',
    content: 'This is a warning message',
  })
}
</script>

<template>
  <ContextHolder />
  <a-space>
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
