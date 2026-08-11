# Gradient Button

## Description (en-US)

You can add custom styles by setting `button.classes` in ConfigProvider. This example shows how to add a gradient effect to buttons.

## Source

```vue
<script setup lang="ts">
import { AntDesignOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-config-provider
    :button="{
      classes: {
        root: 'linear-gradient-button',
      },
    }"
  >
    <a-space>
      <a-button type="primary" size="large">
        <template #icon>
          <AntDesignOutlined />
        </template>
        Gradient Button
      </a-button>
      <a-button size="large">
        Button
      </a-button>
    </a-space>
  </a-config-provider>
</template>

<style>
.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) {
  position: relative;
}

.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous) > span {
  position: relative;
}

.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous)::before {
  content: '';
  background: linear-gradient(135deg, #6253e1, #04befe);
  position: absolute;
  inset: -1px;
  opacity: 1;
  transition: all 0.3s;
  border-radius: inherit;
}

.linear-gradient-button.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous):hover::before {
  opacity: 0;
}
</style>
```
