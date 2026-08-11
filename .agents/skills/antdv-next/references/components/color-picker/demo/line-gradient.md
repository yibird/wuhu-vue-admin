# Line Gradient

## Description (en-US)

Set the color to a single or a gradient color via `mode`.

## Source

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'

const DEFAULT_COLOR = [
  {
    color: 'rgb(16, 142, 233)',
    percent: 0,
  },
  {
    color: 'rgb(135, 208, 104)',
    percent: 100,
  },
]

const color = shallowRef(DEFAULT_COLOR.map(item => ({ ...item })))
const gradientOnly = shallowRef(DEFAULT_COLOR.map(item => ({ ...item })))

function handleChangeComplete(value: any) {
  console.log(value.toCssString())
}
</script>

<template>
  <a-space vertical>
    <a-color-picker
      v-model:value="color"
      allow-clear
      show-text
      :mode="['single', 'gradient']"
      @change-complete="handleChangeComplete"
    />
    <a-color-picker
      v-model:value="gradientOnly"
      allow-clear
      show-text
      mode="gradient"
      @change-complete="handleChangeComplete"
    />
  </a-space>
</template>
```
