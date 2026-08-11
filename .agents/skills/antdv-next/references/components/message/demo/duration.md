# Customize duration

## Description (en-US)

Customize message display duration from default `3s` to `10s`.

## Source

```vue
<script setup lang="ts">
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

function success() {
  messageApi.open({
    type: 'success',
    content: 'This is a prompt message for success, and it will disappear in 10 seconds',
    duration: 10,
  })
}
</script>

<template>
  <ContextHolder />
  <a-button @click="success">
    Customized display duration
  </a-button>
</template>
```
