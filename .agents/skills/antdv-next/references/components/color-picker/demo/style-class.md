# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const classes = { root: 'custom-color-picker' }

const color = shallowRef('#1677ff')
const colorLarge = shallowRef('#722ed1')

const stylesObject = {
  popup: {
    root: {
      border: '1px solid #fff',
    },
  },
}

function stylesFn(info: any) {
  if (info?.props?.size === 'large') {
    return {
      popup: {
        root: {
          border: '1px solid #722ed1',
        },
      },
    }
  }
  return {}
}
</script>

<template>
  <a-space size="middle" wrap>
    <a-color-picker
      v-model:value="color"
      :classes="classes"
      :styles="stylesObject"
      :arrow="false"
    />
    <a-color-picker
      v-model:value="colorLarge"
      size="large"
      :classes="classes"
      :styles="stylesFn"
      :arrow="false"
    />
  </a-space>
</template>

<style>
.custom-color-picker {
  border-radius: 8px;
}
</style>
```
