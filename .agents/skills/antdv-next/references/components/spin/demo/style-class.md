# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { SpinProps } from 'antdv-next'

const classes: SpinProps['classes'] = {
  root: 'demo-spin-root',
}

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#00d4ff',
  },
}

const stylesFn: SpinProps['styles'] = (info) => {
  if (info?.props?.size === 'small') {
    return {
      indicator: {
        color: '#722ed1',
      },
    }
  }
  return {}
}

const sharedProps: SpinProps = {
  spinning: true,
  percent: 0,
  classes,
}
</script>

<template>
  <a-flex align="center" gap="middle">
    <a-spin v-bind="sharedProps" :styles="stylesObject" />
    <a-spin v-bind="sharedProps" :styles="stylesFn" size="small" />
  </a-flex>
</template>

<style>
.demo-spin-root {
  padding: 8px;
}
</style>
```
