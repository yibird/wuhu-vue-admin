# Placement

## Description (en-US)

A notification box can appear from the `top` `bottom` `topLeft` `topRight` `bottomLeft` or `bottomRight` of the viewport via `placement`.

## Source

```vue
<script lang="ts" setup>
import { BorderBottomOutlined, BorderTopOutlined, RadiusBottomleftOutlined, RadiusBottomrightOutlined, RadiusUpleftOutlined, RadiusUprightOutlined } from '@antdv-next/icons'
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()

function openNotification(placement: string) {
  api.info({
    title: `Notification ${placement}`,
    description: 'This is the content of the notification.',
    placement: placement as any,
  })
}
</script>

<template>
  <ContextHolder />
  <a-space>
    <a-button type="primary" @click="openNotification('top')">
      <template #icon>
        <BorderTopOutlined />
      </template>
      top
    </a-button>
    <a-button type="primary" @click="openNotification('bottom')">
      <template #icon>
        <BorderBottomOutlined />
      </template>
      bottom
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openNotification('topLeft')">
      <template #icon>
        <RadiusUpleftOutlined />
      </template>
      topLeft
    </a-button>
    <a-button type="primary" @click="openNotification('topRight')">
      <template #icon>
        <RadiusUprightOutlined />
      </template>
      topRight
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openNotification('bottomLeft')">
      <template #icon>
        <RadiusBottomleftOutlined />
      </template>
      bottomLeft
    </a-button>
    <a-button type="primary" @click="openNotification('bottomRight')">
      <template #icon>
        <RadiusBottomrightOutlined />
      </template>
      bottomRight
    </a-button>
  </a-space>
</template>
```
