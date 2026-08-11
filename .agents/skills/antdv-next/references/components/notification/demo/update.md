# Update message content

## Description (en-US)

Update content with a unique key.

## Source

```vue
<script setup lang="ts">
import { notification } from 'antdv-next'

const key = 'updatable'

const [api, ContextHolder] = notification.useNotification()

function openNotification() {
  api.open({
    key,
    title: 'Notification Title',
    description: 'description.',
  })

  setTimeout(() => {
    api.open({
      key,
      title: 'New Title',
      description: 'New description.',
    })
  }, 1000)
}
</script>

<template>
  <ContextHolder />
  <a-button type="primary" @click="openNotification">
    Open the notification box
  </a-button>
</template>
```
