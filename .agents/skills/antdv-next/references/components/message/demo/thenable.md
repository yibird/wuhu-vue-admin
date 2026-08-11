# Promise interface

## Description (en-US)

`message` provides a promise interface for `onClose`. The above example will display a new message when the old message is about to close.

## Source

```vue
<script setup lang="ts">
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()
function success() {
  messageApi.open({
    type: 'loading',
    content: 'Action in progress..',
    duration: 2.5,
  }).then(
    () => message.success('Loading finished', 2.5),
  ).then(
    () => message.info('Loading Finished ', 2.5),
  )
}
</script>

<template>
  <ContextHolder />
  <a-button @click="success">
    Display a loading indicator
  </a-button>
</template>
```
