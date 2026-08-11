# Vertical

## Description (en-US)

The vertical Slider.

## Source

```vue
<script setup lang="ts">
import { h, ref } from 'vue'

const value = ref(30)
const valueRange = ref([20, 50])
const valueMarks = ref([26, 37])

const style = {
  display: 'inline-block',
  height: '300px',
  marginInlineStart: '70px',
}

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: { color: '#f50' },
    label: h('strong', '100°C'),
  },
}
</script>

<template>
  <div :style="style">
    <a-slider v-model:value="value" vertical />
  </div>
  <div :style="style">
    <a-slider v-model:value="valueRange" vertical range :step="10" />
  </div>
  <div :style="style">
    <a-slider v-model:value="valueMarks" vertical range :marks="marks" />
  </div>
</template>
```
