# Event

## Description (en-US)

The `onChange` callback function will fire when the user changes the slider's value. The `onChangeComplete` callback function will fire when `mouseup` or `keyup` fired.

## Source

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
const valueRange = ref([20, 50])

function onChange(val: number | number[]) {
  console.log('onChange: ', val)
}

function onChangeComplete(val: number | number[]) {
  console.log('onChangeComplete: ', val)
}
</script>

<template>
  <a-slider v-model:value="value" @change="onChange" @after-change="onChangeComplete" />
  <a-slider
    v-model:value="valueRange"
    range
    :step="10"
    @change="onChange"
    @after-change="onChangeComplete"
  />
</template>
```
