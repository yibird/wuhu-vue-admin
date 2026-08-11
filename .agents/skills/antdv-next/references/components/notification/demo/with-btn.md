# Custom close button

## Description (en-US)

To customize the style or font of the close button.

## Source

```vue
<script setup lang="ts">
import { Button, notification, Space } from 'antdv-next'
import { h } from 'vue'

const [api, ContextHolder] = notification.useNotification()

function close() {
  console.log('Notification was closed. Either the close button was clicked or duration time elapsed.')
}

function openNotification() {
  const key = `open${Date.now()}`
  const actions = h(
    Space,
    { size: 8 },
    () => [
      h(
        Button,
        {
          type: 'link',
          size: 'small',
          onClick: () => api.destroy(),
        },
        { default: () => 'Destroy All' },
      ),
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => api.destroy(key),
        },
        { default: () => 'Confirm' },
      ),
    ],
  )

  api.open({
    title: 'Notification Title',
    description:
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
    key,
    onClose: close,
    actions,
  })
}
</script>

<template>
  <ContextHolder />
  <a-button type="primary" @click="openNotification">
    Open the notification box
  </a-button>
</template>
```
