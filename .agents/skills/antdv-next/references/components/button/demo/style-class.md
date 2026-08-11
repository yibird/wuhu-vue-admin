# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { ButtonProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: ButtonProps['classes'] = {
  root: 'demo-button-root',
  content: 'demo-button-content',
}

const stylesObject: ButtonProps['styles'] = {
  root: {
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
}

const stylesFn: ButtonProps['styles'] = (info) => {
  if (info?.props?.type === 'primary') {
    return {
      root: {
        backgroundColor: '#171717',
      },
      content: {
        color: '#fff',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="small">
    <a-button type="default" :classes="classes" :styles="stylesObject">
      Object
    </a-button>
    <a-button type="primary" :classes="classes" :styles="stylesFn">
      Function
    </a-button>
  </a-flex>
</template>

<style>
.demo-button-root {
  border: 1px solid v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
  padding: v-bind('`${token.paddingXS}px`') v-bind('`${token.padding}px`');
  height: auto;
}

.demo-button-content {
  color: v-bind('token.colorText');
}
</style>
```
