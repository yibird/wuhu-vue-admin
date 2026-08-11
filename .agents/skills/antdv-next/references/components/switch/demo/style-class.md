# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes = {
  root: 'custom-switch-root',
}

const stylesObject = {
  root: {
    backgroundColor: '#F5D2D2',
  },
}

function stylesFn(info: any) {
  if (info.props.size === 'medium') {
    return {
      root: {
        backgroundColor: '#BDE3C3',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-switch
      size="small"
      checked-children="on"
      un-checked-children="off"
      :classes="classes"
      :styles="stylesObject"
    />
    <a-switch :classes="classes" size="medium" :styles="stylesFn" />
  </a-flex>
</template>

<style scoped>
.custom-switch-root {
  width: 40px;
  background-color: v-bind('token.colorPrimary');
}
</style>
```
