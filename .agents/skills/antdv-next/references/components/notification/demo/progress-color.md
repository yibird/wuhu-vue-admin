# Customize progress bar color

## Description (en-US)

Customize the progress bar color by configuring the component token.

## Source

```vue
<script setup lang="ts">
import { notification } from 'antdv-next'

const COLOR_BG = 'linear-gradient(135deg, #6253e1, #04befe)'

const [api, ContextHolder] = notification.useNotification()

function openNotification() {
  api.open({
    title: 'Customize progress bar color',
    description: 'You can use component token to customize the progress bar color',
    showProgress: true,
    duration: 20,
  })
}
</script>

<template>
  <a-config-provider
    :theme="{
      components: {
        Notification: {
          progressBg: COLOR_BG,
        },
      },
    }"
  >
    <ContextHolder />
    <a-button class="linear-gradient-button" type="primary" @click="openNotification">
      Show custom progress color
    </a-button>
  </a-config-provider>
</template>

<style>
.linear-gradient-button {
  background: linear-gradient(135deg, #6253e1, #04befe);
  border-color: transparent;
}

.linear-gradient-button:hover {
  background: linear-gradient(135deg, #6f60e8, #2fc9ff);
}
</style>
```
