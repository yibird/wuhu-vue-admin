# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import type { TimePickerProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { useToken } = theme
const { token } = useToken()

const customClasses = {
  root: 'custom-timepicker-root',
}

const stylesObject: TimePickerProps['styles'] = {
  root: {
    borderColor: '#d9d9d9',
  },
}

const stylesFn: TimePickerProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: {
        borderColor: '#722ed1',
      },
      suffix: {
        color: '#722ed1',
      },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: '8px' },
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-time-picker :classes="customClasses" :styles="stylesObject" placeholder="Object" />
    <a-time-picker :classes="customClasses" :styles="stylesFn" placeholder="Function" size="large" />
  </a-flex>
</template>

<style scoped>
.custom-timepicker-root {
  border: 1px solid v-bind('token.colorPrimary');
  width: 150px;
}
</style>
```
