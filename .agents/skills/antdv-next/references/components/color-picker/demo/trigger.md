# Custom Trigger

## Description (en-US)

Triggers for customizing color panels.

## Source

```vue
<script setup lang="ts">
import type { ColorValueType } from 'antdv-next'
import { computed, shallowRef } from 'vue'

type Color = Extract<ColorValueType, string | { cleared: any }>

const color = shallowRef<Color>('#1677ff')

const bgColor = computed(() => {
  return typeof color.value === 'string'
    ? color.value
    : color.value?.toHexString?.() ?? '#1677ff'
})
</script>

<template>
  <a-color-picker v-model:value="color">
    <a-button type="primary" :style="{ backgroundColor: bgColor }">
      open
    </a-button>
  </a-color-picker>
</template>
```
