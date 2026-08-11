# Clear Color

## Description (en-US)

Clear Color.

## Source

```vue
<script setup lang="ts">
import type { ColorValueType } from 'antdv-next'
import { shallowRef } from 'vue'

const color = shallowRef<ColorValueType>('#1677ff')
</script>

<template>
  <a-color-picker v-model:value="color" allow-clear />
</template>
```
