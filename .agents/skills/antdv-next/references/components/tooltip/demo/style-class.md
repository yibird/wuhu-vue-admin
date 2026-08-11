# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { TooltipProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: TooltipProps['classes'] = {
  container: 'demo-tooltip-container',
}

const stylesObject: TooltipProps['styles'] = {
  container: {
    borderRadius: '12px',
    boxShadow: 'inset 0 0 8px #ccc',
  },
}

const stylesFn: TooltipProps['styles'] = (info) => {
  if (info?.props?.arrow === false) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        color: '#fff',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="middle">
    <a-tooltip title="Object text" :classes="classes" :styles="stylesObject" :arrow="false">
      <a-button>Object Style</a-button>
    </a-tooltip>
    <a-tooltip title="Function text" :classes="classes" :styles="stylesFn" :arrow="false">
      <a-button type="primary">
        Function Style
      </a-button>
    </a-tooltip>
  </a-flex>
</template>

<style>
.demo-tooltip-container {
  padding: v-bind('`${token.paddingXS}px`');
  border: 1px dashed v-bind('token.colorBorder');
}
</style>
```
