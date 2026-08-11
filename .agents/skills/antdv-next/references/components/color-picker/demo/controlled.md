# controlled mode

## Description (en-US)

Set the component to controlled mode. Will lock the display color if controlled by `onChangeComplete`.

## Source

```vue
<script setup lang="ts">
import type { Color, ColorValueType } from 'antdv-next'
import { shallowRef } from 'vue'

const color = shallowRef<ColorValueType>('#1677ff')

function handleChangeComplete(value: Color) {
  color.value = value
}
</script>

<template>
  <a-space>
    <a-color-picker v-model:value="color" />
    <a-color-picker :value="color" @change-complete="handleChangeComplete" />
  </a-space>
</template>
```
